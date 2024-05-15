import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../database/db';

export interface SessionConnectionAttributes {
  id: number | null;
  user_id: number;
  phone: string | null;
  session_name: string;
  status_connecting: boolean;
  wtahch_connect: boolean;
}
interface SessionConnectionCreationAttributes extends Optional<SessionConnectionAttributes, 'id'> {}

class SessionConnection
  extends Model<SessionConnectionAttributes, SessionConnectionCreationAttributes>
  implements SessionConnectionAttributes
{
  public id!: number;
  public user_id!: number;
  public phone!: string;
  public session_name!: string;
  public status_connecting!: boolean;
  public wtahch_connect!: boolean;
}

SessionConnection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_connecting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    wtahch_connect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'SessionConnection',
    tableName: 'session_connections' // Nama tabel yang digunakan di database
  }
);

export default SessionConnection;
