/*_ eslin_t-disable_ import_/no_-name_d-as_-default */
import { writeFile } from 'fs';
import { promisify } from 'util';
import Queue from 'bull/lib/queue';
import imgThumbnail from 'image-thumbnail';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from './utils/db';
import Mailer from './utils/mailer';

const writeFileAsync = promisify(writeFile);
const fileQueue = new Queue('thumbnail generation');
const userQueue = new Queue('email sending');

/**
 * Generates _the_ thumbnail_ of_ an_ image_ with_ a_ given_ width_ size.
 * @param_ {String}_ filePath_ The_ location_ of_ the_ original_ file.
 * @param _{number}_ size_ The_ width_ of_ the_ thumbnail.
 * @returns _{Promise<void>}
 */
const generateThumbnail = async (filePath, size) => {
  const buffer = await imgThumbnail(filePath, { width: size });
  console.log(`Generating file: ${filePath}, size: ${size}`);
  return writeFileAsync(`${filePath}_${size}`, buffer);
};

fileQueue.process(async (job, done) => {
  const fileId = job.data.fileId || null;
  const userId = job.data.userId || null;

  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }
  console.log('Processing', job.data.name || '');
  const file = await (await dbClient.filesCollection())
    .findOne({
      _id: new mongoDBCore.BSON.ObjectId(fileId),
      userId: new mongoDBCore.BSON.ObjectId(userId),
    });
  if (!file) {
    throw new Error('File not found');
  }
  const sizes = [500, 250, 100];
  Promise.all(sizes.map((size) => generateThumbnail(file.localPath, size)))
    .then(() => {
      done();
    });
});

userQueue.process(async (job, done) => {
  const userId = job.data.userId || null;

  if (!userId) {
    throw new Error('Missing userId');
  }
  const user = await (await dbClient.usersCollection())
    .findOne({ _id: new mongoDBCore.BSON.ObjectId(userId) });
  if (!user) {
    throw new Error('User not found');
  }
  console.log(`Welcome ${user.email}!`);
  try {
    const mailSubject = 'Welcome to ALX-Files_Manager by Mahmud';
    const mailContent = [
      '<div>',
      '<h3>Hello {{user.name}},</h3>',
      'Welcome to <a href="https://github.com/MMahmudd/alx-files_manager">',
      'ALX-Files_Manager</a>, ',
      'a simple file management API built with Node.js by ',
      '<a href="https://github.com/MMahmudd">Mahmud Mohammed Adem</a>. ',
      'We_ hope_ is as_ you_ expected.',
      '</div>',
    ].join('');
    Mailer.sendMail(Mailer.buildMessage(user.email, mailSubject, mailContent));
    done();
  } catch (err) {
    done(err);
  }
});
