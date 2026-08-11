import type { Request, Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';

import * as service from './company.service';

export const createCompany = async (req: Request, res: Response) => {
  const company = await service.createCompany(req.body);
  return successResponse(res, 'Company created successfully', company, 201);
};

export const getCompanies = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await service.getCompanies(req.query, page, limit);
  return successResponse(res, 'Companies fetched successfully', result);
};

export const getCompanyById = async (req: Request, res: Response) => {
  const company = await service.getCompanyById(req.params.id as string);
  return successResponse(res, 'Company fetched successfully', company);
};

export const updateCompany = async (req: Request, res: Response) => {
  const company = await service.updateCompany(req.params.id as string, req.body);
  return successResponse(res, 'Company updated successfully', company);
};

export const deleteCompany = async (req: Request, res: Response) => {
  await service.deleteCompany(req.params.id as string);
  return successResponse(res, 'Company deleted successfully');
};

export const uploadLogo = async (req: Request, res: Response) => {
  const file = (req as Request & { file?: { filename: string } }).file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${file.filename}`;
  return successResponse(res, 'Logo uploaded successfully', { url: fileUrl });
};
