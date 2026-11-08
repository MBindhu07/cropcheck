import { z } from 'zod';

import { CROP_TYPES } from '@/constants/crops';

const positiveNumber = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter the ${label}`)
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), `Enter the ${label} as a number`)
    .transform(Number)
    .refine((value) => value > 0, `The ${label} must be more than zero`);

export const produceSchema = z.object({
  crop: z.enum(CROP_TYPES, { error: 'Choose a crop' }),
  quantity: positiveNumber('quantity'),
  price: positiveNumber('price'),
  location: z.string().trim().min(2, 'Enter where the produce is available'),
  photoUri: z.string({ error: 'Add a photo of your produce' }).min(1, 'Add a photo of your produce'),
});

export type ProduceFormValues = z.input<typeof produceSchema>;
export type ProduceFormErrors = Partial<Record<keyof ProduceFormValues, string>>;

export function validateProduce(values: {
  crop: string | null;
  quantity: string;
  price: string;
  location: string;
  photoUri: string | null;
}) {
  const result = produceSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: {} as ProduceFormErrors };

  const errors: ProduceFormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ProduceFormValues;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { data: null, errors };
}
