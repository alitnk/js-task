export class FooService {
  constructor(private readonly value = "bar") {}

  getValue() {
    return this.value;
  }
}
