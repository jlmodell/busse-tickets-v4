import { z } from "zod";

const typeEnum = z.enum(["it", "maintenance"]);
const departmentEnum = z.enum([
  "packaging",
  "manufacturing",
  "accounting",
  "order processing",
  "purchasing",
  "shipping",
  "traffic",
  "receiving",
  "long island sterilization",
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

const ticketSchema = z.object({
  _id: z.string(),
  type: typeEnum,

  department: departmentEnum,
  submittedBy: z.string(),
  contactInfo: z.string(),

  description: z.string(),

  assignedTo: z.string(),
  notes: z.string(),

  completed: z.boolean(),
  respondedTo: z.boolean(),
  followedUp: z.boolean(),

  createdAt: z.date(),
  updatedAt: z.date(),

  files: z.array(fileSchema),
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
  _id: z.string(),
  type: typeEnum,
  department: departmentEnum,
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
