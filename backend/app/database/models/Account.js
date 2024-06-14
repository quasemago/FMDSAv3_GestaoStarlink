import Sequelize, {Model} from "sequelize";
import bcryptjs from "bcryptjs";

export default class Account extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                email: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                    validate: {
                        isEmail: {
                            msg: "Invalid email."
                        }
                    }
                },
                password_hash: {
                    type: Sequelize.STRING,
                },
                password: {
                    type: Sequelize.VIRTUAL,
                    validate: {
                        len: {
                            args: [6, 50],
                            msg: "The password must be between 6 and 50 characters."
                        }
                    }
                },
                role: {
                    type: Sequelize.ENUM('USER', 'ADMIN'),
                    allowNull: false,
                },
            }, {
                sequelize,
                tableName: "accounts",
            });

        this.addHook('beforeSave', async (account) => {
            if (account.password) {
                account.password_hash = await bcryptjs.hash(account.password, 8);
            }
        });

        return this;
    }

    static associate(models) {
        this.hasOne(models.Client, {
            foreignKey: 'account_id'
        });
    }

    passwordIsCorrect(password) {
        return bcryptjs.compare(password, this.password_hash);
    }
}