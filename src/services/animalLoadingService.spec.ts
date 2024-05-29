/* eslint-disable no-undef */
import { AnimalLoadingService } from './animalLoadingService';
import { Animal } from '../models/animal';
import * as path from 'path';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('path');
jest.mock('../models/animal');

describe('AnimalLoadingService', () => {
  let service: AnimalLoadingService;

  beforeEach(() => {
    service = new AnimalLoadingService();
  });

  describe('loadAnimals', () => {
    it('should load animals from the specified directory', () => {
      const directory = 'test_directory';
      const maxAnts = 2;

      const mockFiles = ['file1', 'file2', 'file3'];
      const mockData = 'mock_data';

      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (fs.readFileSync as jest.Mock).mockReturnValue(mockData);
      (path.join as jest.Mock).mockImplementation((dir, file) => `${dir}/${file}`);
      (path.basename as jest.Mock).mockImplementation((file, ext) => file.replace(ext, ''));
      (Animal.CreateAnimal as jest.Mock).mockReturnValue(new Animal());

      const result = service.loadAnimals(directory, maxAnts);

      expect(fs.readdirSync).toHaveBeenCalledWith(directory);
      expect(fs.readFileSync).toHaveBeenCalledTimes(mockFiles.length);
      expect(path.join).toHaveBeenCalledTimes(mockFiles.length);
      expect(path.basename).toHaveBeenCalledTimes(mockFiles.length);
      expect(Animal.CreateAnimal).toHaveBeenCalledTimes(mockFiles.length);
      expect(result.length).toBe(maxAnts);
    });
  });
});
