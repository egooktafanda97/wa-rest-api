import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../database/db';

interface BotLogicAttributes {
  id: number;
  logic_type: string;
  msg_trigger: string;
  actions_roles: string;
  separator: string;
  status: boolean;
}

interface BotLogicCreationAttributes extends Optional<BotLogicAttributes, 'id'> {}

class BotLogic extends Model<BotLogicAttributes, BotLogicCreationAttributes> implements BotLogicAttributes {
  public id!: number;
  public logic_type!: string;
  public msg_trigger!: string;
  public actions_roles!: string;
  public status!: boolean;
  public separator!: string;
  // Metode statis untuk mendefinisikan relasi
  public static associate(models: any) {
    BotLogic.belongsTo(models.UserConnection, {
      foreignKey: 'UserConnectionId',
      as: 'sender'
    });
  }
}

BotLogic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    logic_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    msg_trigger: {
      type: DataTypes.STRING,
      allowNull: false
    },
    actions_roles: {
      type: DataTypes.STRING,
      allowNull: false
    },
    separator: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'BotLogic',
    tableName: 'bot_logic' // Nama tabel yang digunakan di database
  }
);

export default BotLogic;
