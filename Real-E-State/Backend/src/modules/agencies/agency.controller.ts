import type { Request, Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';

import * as service from './agency.service';

export const createAgency = async (req: Request, res: Response) => {
  const agency = await service.createAgency(req.body);
  return successResponse(res, 'Agency created successfully', agency, 201);
};

export const getAgencies = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await service.getAgencies(req.query, page, limit);
  return successResponse(res, 'Agencies fetched successfully', result);
};

export const getAgencyById = async (req: Request, res: Response) => {
  const agency = await service.getAgencyById(req.params.id as string);
  return successResponse(res, 'Agency fetched successfully', agency);
};

export const updateAgency = async (req: Request, res: Response) => {
  const agency = await service.updateAgency(req.params.id as string, req.body);
  return successResponse(res, 'Agency updated successfully', agency);
};

export const deleteAgency = async (req: Request, res: Response) => {
  await service.deleteAgency(req.params.id as string);
  return successResponse(res, 'Agency deleted successfully');
};

export const uploadLogo = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: { filename: string } }).file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${file.filename}`;
  return successResponse(res, 'Logo uploaded successfully', { url: fileUrl });
};
