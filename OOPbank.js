#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
class Customer {
    FirstName;
    LastName;
    Gender;
    Age;
    MobileNumber;
    bankacc;
    constructor(FirstName, LastName, Gender, Age, MobileNumber, bankacc) {
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Gender = Gender;
        this.Age = Age;
        this.MobileNumber = MobileNumber;
        this.bankacc = bankacc;
    }
}
class BankAccount {
    AccountBalance;
    cust = [];
    account = [];
    AccNo;
    constructor() {
        this.AccountBalance = 100;
    }
    Add_Cust(bobj) {
        this.cust.push(bobj);
    }
    Add_accno(accobj) {
        this.account.push(accobj);
    }
    Debit(amount, accno) {
        let statment = chalk.red.bold("Sorry you have insufficient balance");
        if (amount > 0) {
            statment = chalk.red.bold("The amount you entered is wrong");
            if (accno.AccountBalance > amount) {
                accno.AccountBalance -= amount;
                statment = chalk.green.italic(`Transaction successful! Now account has balance of:${accno.AccountBalance}`);
            }
            else {
                statment = chalk.red.italic("You don't have enough money to do this transcation");
            }
        }
        return statment;
    }
    Credit(amount, accno) {
        let statment = chalk.red.bold("Transaction Failed!");
        if (amount > 0) {
            accno.AccountBalance += amount;
            if (amount > 100) {
                accno.AccountBalance--;
            }
            statment = chalk.green.italic("Your account has been credited successfully!");
        }
        return statment;
    }
}
let Bank = new BankAccount();
for (let i = 1; i <= 5; i++) {
    let f_name = faker.person.firstName('female');
    let l_name = faker.person.lastName();
    let MobNo = Math.floor(Math.random() * Math.pow(10, 10));
    let customer = new Customer(f_name, l_name, 'Female', 18 * i, MobNo, 1000 + i);
    Bank.Add_Cust(customer);
    Bank.Add_accno({ AccNo: customer.bankacc, AccountBalance: 100 * i });
}
async function BankOperations() {
    do {
        let ask = await inquirer.prompt([
            {
                name: "Service",
                type: "list",
                message: "Choose Bank Services:",
                choices: ["View Balance", "Cash WithDraw", "Cash Deposit", "Exit"]
            }
        ]);
        if (ask.Service == "View Balance") {
            let ac = await inquirer.prompt([
                {
                    type: "number",
                    name: "No",
                    message: "Enter your Account number:"
                }
            ]);
            let accno = Bank.account.find((acc) => acc.AccNo == ac.No);
            if (!accno) {
                console.log(chalk.red.bold("Invalid Account number"));
            }
            else {
                let info = Bank.cust.find((item) => item.bankacc == accno?.AccNo);
                console.log(chalk.green(`Account Holder ${chalk.bold(info?.FirstName)} ${chalk.bold(info?.LastName)} has $${chalk.italic(accno.AccountBalance)} Balance`));
            }
        }
        else if (ask.Service == "Cash WithDraw") {
            let ac = await inquirer.prompt([
                {
                    type: "number",
                    name: "No",
                    message: "Enter your Account number:"
                }
            ]);
            let accno = Bank.account.find((acc) => acc.AccNo == ac.No);
            if (!accno) {
                console.log(chalk.red.bold("Invalid Account number"));
            }
            else {
                let amount = await inquirer.prompt([
                    {
                        type: "number",
                        name: "No",
                        message: "Enter your Amount to be Withdraw:"
                    }
                ]);
                console.log(Bank.Debit(amount.No, accno));
            }
        }
        else if (ask.Service == "Cash Deposit") {
            let ac = await inquirer.prompt([
                {
                    type: "number",
                    name: "No",
                    message: "Enter your Account number:"
                }
            ]);
            let accno = Bank.account.find((acc) => acc.AccNo == ac.No);
            if (!accno) {
                console.log(chalk.red.bold("Invalid Account number"));
            }
            else {
                let amount = await inquirer.prompt([
                    {
                        type: "number",
                        name: "No",
                        message: "Enter your Amount to be Withdraw:"
                    }
                ]);
                console.log(Bank.Credit(amount.No, accno));
            }
        }
        else if (ask.Service == "Exit") {
            return;
        }
    } while (true);
}
BankOperations();
