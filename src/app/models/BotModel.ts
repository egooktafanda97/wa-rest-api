import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../database/db';
import UserConnection from './SessionConnection';

interface BotAttributes {
  id: number;
  UserConnectionId: number;
  session_name: string;
  client: string;
  bot_start: number;
  bot_end: number | null;
  boot_type: string;
  status_bot: boolean;
}

interface BotCreationAttributes extends Optional<BotAttributes, 'id'> {}

class BotModel extends Model<BotAttributes, BotCreationAttributes> implements BotAttributes {
  public id!: number;
  public UserConnectionId!: number;
  public session_name!: string;
  public client!: string;
  public bot_start!: number;
  public bot_end!: number | null;
  public boot_type!: string;
  public status_bot!: boolean;

  public readonly sender?: UserConnection; // Relasi dengan UserConnection

  // Metode statis untuk mendefinisikan relasi
  public static associate(models: any) {
    BotModel.belongsTo(models.UserConnection, {
      foreignKey: 'UserConnectionId',
      as: 'sender'
    });
  }
}

BotModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserConnectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    session_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bot_start: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bot_end: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    boot_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_bot: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'BotModel',
    tableName: 'bot_connect' // Nama tabel yang digunakan di database
  }
);

export default BotModel;
