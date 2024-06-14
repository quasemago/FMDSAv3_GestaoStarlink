import Sequelize, {Model} from "sequelize";

export default class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                tel: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                    validate:{
                        is: /^\d{11}$/
                    }
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                birthDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                gender: {
                    type: Sequelize.ENUM('M', 'F'),
                    allowNull: false,
                },
                profilePicture: {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            }, {
                sequelize,
                tableName: "clients",
            });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Account, {
            foreignKey: 'account_id'
        });
        this.hasOne(models.OnlineActivity, {
            foreignKey: 'client_id'
        });
    }
}