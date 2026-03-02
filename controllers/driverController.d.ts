import { Request, Response } from "express";
export declare const updateLocation: (req: Request, res: Response) => Promise<void>;
export declare const toggleAvailability: (req: Request, res: Response) => Promise<void>;
export declare const fetchCurrentLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getNearbyDrivers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=driverController.d.ts.map