import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const connect: any = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'mysql',
};

const sequelize = new Sequelize(connect);

export default sequelize;
