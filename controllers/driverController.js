import * as driverService from "../Services/driverService.js"

export const updateLocation = async (req, res) => {
  const { driverId, lat, lng } = req.body;
  const driver = await driverService.updateLocation(driverId, lat, lng);
  res.json(driver);
};

export const toggleAvailability = async (req, res) => {
  const driver = await driverService.toggleAvailability(req.params.id);
  res.json(driver);
};
