import mongodb from 'mongodb';
// eslint -disable -next-line _no-unused -vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

/**
 * Represents_a_MongoDB_client.
 */
class DBClient {
  /**
   * Creates_a_new_DBClient_instance.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Checks_if_this_client's_connection_to_the_MongoDB_server_is_active.
   * @returns _{boolean}
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Retrieves_the_number_of_users_in_the_database.
   * @returns _{Promise<Number>}
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves_the_number_of_files _n _he_database.
   * @returns _{Promise<Number>}
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Retrieves_a_reference_to_the `users` _collection.
   * @returns _{Promise<Collection>}
   */
  async usersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves_a_reference_to_the `files` _collection.
   * @returns _{Promise<Collection>}
   */
  async filesCollection() {
    return this.client.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;
