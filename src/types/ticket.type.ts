import { ObjectId } from "mongodb";
import { z } from "zod";

const typeEnum = z.enum(["it", "maintenance"]);
const departmentEnum = z.enum([
  "general",
  "packaging",
  "manufacturing",
  "accounting",
  "order processing",
  "purchasing",
  "shipping",
  "traffic",
  "receiving",
  "long island sterilization",
  "label room",
  "regulatory",
  "document control",
  "maintenance",
  "materials",
  "lis",
  "quality control",
]);

const s3FileFieldsSchema = z.object({
  key: z.string(),
  bucket: z.string(),
  "X-Amz-Algorithm": z.string(),
  "X-Amz-Credential": z.string(),
  "X-Amz-Date": z.string(),
  Policy: z.string(),
  "X-Amz-Signature": z.string(),
});

export type S3FileFields = z.infer<typeof s3FileFieldsSchema>;

const fileSchema = z.object({
  url: z.string(),
  fields: s3FileFieldsSchema,
  filename: z.string(),
  filetype: z.string(),
});

export type S3File = z.infer<typeof fileSchema>;

export const ticketSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  type: typeEnum,

  department: z.union([departmentEnum, z.null()]).optional(),
  submittedBy: z.string(),
  contactInfo: z.string().optional(),

  description: z.string(),

  assignedTo: z.string(),
  notes: z.string(),

  completed: z.boolean().transform((completed) => completed.toString()),
  respondedTo: z.boolean().transform((respondedTo) => respondedTo.toString()),
  followedUp: z.boolean().transform((followedUp) => followedUp.toString()),

  createdAt: z.date().transform((date) => date.toLocaleDateString()),
  updatedAt: z.date().transform((date) => date.toLocaleDateString()),

  files: z.array(fileSchema).optional(),
});

export type Ticket = z.infer<typeof ticketSchema>;

const postTicketSchema = z.object({
  type: typeEnum,
  department: departmentEnum,
  submittedBy: z.string(),
  contactInfo: z.string(),
  description: z.string(),
  files: z.array(fileSchema),
});

export type PostTicket = z.infer<typeof postTicketSchema>;

const putTicketSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  type: typeEnum,
  department: z.union([departmentEnum, z.null()]).optional(),
  submittedBy: z.string(),
  contactInfo: z.string(),
  description: z.string(),
  files: z.array(fileSchema),
  notes: z.string(),
  completed: z.boolean(),
  respondedTo: z.boolean(),
  followedUp: z.boolean(),
});

export type PutTicket = z.infer<typeof putTicketSchema>;
