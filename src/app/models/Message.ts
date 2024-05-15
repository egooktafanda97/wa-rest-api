import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../database/db';
import UserConnection from './SessionConnection'; // Sesuaikan dengan jalur yang benar

interface MessageAttributes {
  id: number;
  session_id: number;
  chart_session: number;
  remoteJid: string;
  name: string;
  fromMe: boolean;
  from: string;
  to: string;
  text: string;
  status_connecting: boolean;
  bot: boolean;
  messageTimestamp: number;
  UserConnectionId: number; // Atribut baru
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

class MessageConnection extends Model<MessageCreationAttributes, MessageAttributes> implements MessageCreationAttributes {
  public id!: number;
  public session_id!: number;
  public chart_session!: number;
  public remoteJid!: string;
  public name!: string;
  public fromMe!: boolean;
  public from!: string;
  public to!: string;
  public text!: string;
  public status_connecting!: boolean;
  public bot!: boolean;
  public messageTimestamp!: number;
  public UserConnectionId!: number; // Atribut baru

  public readonly sender?: UserConnection; // Relasi dengan UserConnection

  // Metode statis untuk mendefinisikan relasi
  public static associate(models: any) {
    MessageConnection.belongsTo(models.UserConnection, {
      foreignKey: 'UserConnectionId',
      as: 'sender'
    });
  }
}

MessageConnection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chart_session: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remoteJid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fromMe: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    from: {
      type: DataTypes.STRING,
      allowNull: true
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status_connecting: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    bot: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    messageTimestamp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserConnectionId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'MessageConnection',
    tableName: 'messages'
  }
);

export default MessageConnection;
