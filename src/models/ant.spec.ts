/* eslint-disable no-undef */
import { Ant } from './ant';

describe('Ant', () => {
  it('should create an instance with the correct properties', () => {
    const ant = new Ant('TestAnt', 'TestCreator', 'return;', 1);
    expect(ant.name).toBe('TestAnt');
    expect(ant.creator).toBe('TestCreator');
    expect(ant.code).toBe('return;');
    expect(ant.type).toBe(1);
    expect(ant.column).toBe(0);
    expect(ant.row).toBe(0);
    expect(ant.score).toBe(0);
    expect(ant.error).toBeUndefined();
    expect(ant.color).toBeDefined();
  });

  it('should set error if code is invalid', () => {
    const ant = new Ant('TestAnt', 'TestCreator', 'return (', 1);
    expect(ant.error).toBeDefined();
  });

  it('should execute doStep without error if code is valid', () => {
    const ant = new Ant('TestAnt', 'TestCreator', 'return;', 1);
    expect(() => ant.doStep({})).not.toThrow();
  });

  it('should throw error if doStep is called and code throws an error', () => {
    const ant = new Ant('TestAnt', 'TestCreator', 'throw new Error("Test error");', 1);
    expect(() => ant.doStep({})).toThrow();
  });
});