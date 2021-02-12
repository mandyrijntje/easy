import { Entity, Enum, includes, required, rule, Struct, valid, validate, Value } from '../../src';
import '@thisisagile/easy-test';

class Price extends Value<number> {
  get isValid(): boolean {
    return this.value > 0 && this.value < 100;
  }
}

class Type extends Enum {
  static readonly Plug = new Type('plug');
  static readonly Bulb = new Type('bulb');
}

class Brand extends Struct {
  readonly name: string = this.state.name;
  readonly site: string = this.state.site;
}

class ConstrainedBrand extends Struct {
  @required() readonly bname: string = this.state.name;
  @includes('www.') @includes('.io') readonly site: string = this.state.site;
}

class Product extends Entity {
  readonly name: string = this.state.name;
  readonly brand: Brand = new Brand(this.state.brand);
  readonly type: Type = Type.byId(this.state.type);
  readonly price: Price = new Price(this.state.price);
}

class ConstrainedProduct extends Entity {
  @required() readonly pname: string = this.state.name;
  @valid() readonly brand: ConstrainedBrand = new ConstrainedBrand(this.state.brand);
  @valid() readonly type: Type = Type.byId(this.state.type);
  @valid() readonly price: Price = new Price(this.state.price);
}

class PricesProduct extends Entity {
  @valid() readonly purchase: Price = new Price(this.state.purchase);
  @valid() readonly sales: Price = new Price(this.state.sales);

  @rule('Sales price {this.sales} should be higher than purchase price {this.purchase}.')
  check = (): boolean => {
    return this.sales.value > this.purchase.value;
  };
}

class Extra {
  constructor(readonly name: string) {}
}

class Email extends Value<string> {
  get isValid(): boolean {
    return this.value.includes('@');
  }
}

describe('validate', () => {
  test('simple', () => {
    expect(validate()).not.toBeValid();
    expect(validate(undefined)).not.toBeValid();
    expect(validate(null)).not.toBeValid();
    expect(validate(false)).toBeValid();
    expect(validate({})).toBeValid();
    expect(validate({ name: 'Kim' })).toBeValid();
    expect(validate('Kim')).toBeValid();
    expect(validate(0)).toBeValid();
    expect(validate(42)).toBeValid();
    expect(validate(new Extra('Kim'))).toBeValid();
  });

  test('enum', () => {
    expect(validate(Type.Plug)).toBeValid();
    expect(validate(Type.byId(Type.Plug.id))).toBeValid();
    expect(validate(Type.byId(666))).not.toBeValid();
  });

  test('value', () => {
    expect(validate(new Email('sander@ditisagile.nl'))).toBeValid();
    expect(validate(new Email(''))).not.toBeValid();
  });

  test('struct with constraints', () => {
    expect(validate(new Brand())).toBeValid();
    expect(validate(new ConstrainedBrand())).toHaveLength(3);
    expect(validate(new ConstrainedBrand({ name: 'easy', site: 'www.easy' }))).toHaveLength(1);
    expect(validate(new ConstrainedBrand({ name: 'easy' }))).toHaveLength(2);
    expect(validate(new ConstrainedBrand({ name: 'easy', site: 'www.easy.io' }))).toBeValid();
  });

  test('entity without constraints', () => {
    expect(validate(new Product())).toHaveLength(1);
    expect(validate(new Product({ id: 42 }))).toBeValid();
  });

  test('entity with (nested) constraints', () => {
    expect(validate(new ConstrainedProduct())).toHaveLength(7);
    expect(validate(new ConstrainedProduct({ id: 42 }))).toHaveLength(6);
    expect(validate(new ConstrainedProduct({ id: 42, price: 666, type: 'bulb' }))).toHaveLength(5);
    expect(validate(new ConstrainedProduct({ id: 42, price: 42, type: 'bulb' }))).toHaveLength(4);
    expect(
      validate(
        new ConstrainedProduct({
          id: 42,
          price: 42,
          type: 'bulb',
          brand: { name: 'Philips', site: 'philips' },
        })
      )
    ).toHaveLength(3);
    expect(
      validate(
        new ConstrainedProduct({
          id: 42,
          price: 42,
          name: 'Hue',
          type: 'bulb',
          brand: { name: 'Philips', site: 'philips' },
        })
      )
    ).toHaveLength(2);
    expect(
      validate(
        new ConstrainedProduct({
          id: 42,
          price: 42,
          name: 'Hue',
          type: 'bulb',
          brand: { name: 'Philips', site: 'www.philips.io' },
        })
      )
    ).toBeValid();
  });

  test('business rule', () => {
    expect(validate(new PricesProduct({ id: 3, purchase: 10, sales: 20 }))).toBeValid();
    expect(validate(new PricesProduct({ id: 3, purchase: 30, sales: 20 }))).not.toBeValid();
  });
});
