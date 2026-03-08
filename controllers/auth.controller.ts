import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { signinDriver, signinCustomer } from "../services/auth.service.js";


export class AuthController {

  static async signupDriver(req: Request, res: Response) {
    try {
      const driver = await AuthService.signupDriver(req.body);

      res.status(201).json({
        success: true,
        message: "Driver registered successfully",
        data: driver
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async signupCustomer(req: Request, res: Response) {
    try {
      const customer = await AuthService.signupCustomer(req.body);

      res.status(201).json({
        success: true,
        message: "Customer registered successfully",
        data: customer
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

}


// controller about signing in the system with JWT authentication

export const loginDriver = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await signinDriver(email, password);

    res.status(200).json({
      success: true,
      message: "Driver login successful",
      token: result.token,
      driver: result.driver
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await signinCustomer(email, password);

    res.status(200).json({
      success: true,
      message: "Customer login successful",
      token: result.token,
      customer: result.customer
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};