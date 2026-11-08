import { validateProduce } from '../produce.schema';

const valid = {
  crop: 'tomato',
  quantity: '250',
  price: '22.5',
  location: 'Guntur, Andhra Pradesh',
  photoUri: 'file:///photo.jpg',
};

describe('validateProduce', () => {
  it('parses numbers out of a valid form', () => {
    const { data, errors } = validateProduce(valid);

    expect(errors).toEqual({});
    expect(data).toMatchObject({ crop: 'tomato', quantity: 250, price: 22.5 });
  });

  it('reports every missing field at once', () => {
    const { data, errors } = validateProduce({
      crop: null,
      quantity: '',
      price: '',
      location: '',
      photoUri: null,
    });

    expect(data).toBeNull();
    expect(Object.keys(errors).sort()).toEqual(['crop', 'location', 'photoUri', 'price', 'quantity']);
  });

  it('rejects zero and malformed amounts', () => {
    expect(validateProduce({ ...valid, quantity: '0' }).errors.quantity).toMatch(/more than zero/);
    expect(validateProduce({ ...valid, price: '12.345' }).errors.price).toMatch(/as a number/);
  });

  it('rejects crops outside the supported list', () => {
    expect(validateProduce({ ...valid, crop: 'mango' }).errors.crop).toBe('Choose a crop');
  });
});
