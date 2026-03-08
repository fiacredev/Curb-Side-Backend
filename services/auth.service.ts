import Driver from "../models/Driver.js";
import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export class AuthService {

  static async signupDriver(data: any) {
    const { name, email, password, location } = data;

    const existing = await Driver.findOne({ email });
    if (existing) {
      throw new Error("Driver already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email,
      password: hashedPassword,
      location
    });

    return driver;
  }

  static async signupCustomer(data: any) {
    const { name, email, password } = data;

    const existing = await Customer.findOne({ email });
    if (existing) {
      throw new Error("Customer already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword
    });

    return customer;
  }

}


// let's deal with sign up here


export const signinDriver = async (email: string, password: string) => {
  const driver = await Driver.findOne({ email });

  if (!driver) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, driver.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    id: driver._id,
    role: "driver"
  });

  return { driver, token };
};

export const signinCustomer = async (email: string, password: string) => {
  const customer = await Customer.findOne({ email });

  if (!customer) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, customer.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    id: customer._id,
    role: "customer"
  });

  return { customer, token };
};