const Product = require('../../models/Product');
const productController = require('../productController');

jest.mock('../../models/Product');

describe('Product Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('createProduct', () => {
    it('should create a product and return 201 status', async () => {
      const productData = { name: 'Test Product', price: 100, reward_type: 'A' };
      req.body = productData;
      Product.create.mockResolvedValue(productData);

      await productController.createProduct(req, res);

      expect(Product.create).toHaveBeenCalledWith(productData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ product: productData });
    });

    it('should return 500 status on error', async () => {
      Product.create.mockRejectedValue(new Error('Database error'));

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return 200 status', async () => {
      const productId = 1;
      const updatedData = { name: 'Updated Product', price: 150, reward_type: 'B' };
      req.params.id = productId;
      req.body = updatedData;
      const mockProduct = { id: productId, ...updatedData, save: jest.fn() };
      Product.findByPk.mockResolvedValue(mockProduct);

      await productController.updateProduct(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith(productId);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ product: mockProduct });
    });

    it('should return 404 status when product is not found', async () => {
      Product.findByPk.mockResolvedValue(null);

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should return 500 status on error', async () => {
      Product.findByPk.mockRejectedValue(new Error('Database error'));

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return 204 status', async () => {
      const productId = 1;
      req.params.id = productId;
      const mockProduct = { id: productId, destroy: jest.fn() };
      Product.findByPk.mockResolvedValue(mockProduct);

      await productController.deleteProduct(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith(productId);
      expect(mockProduct.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 status when product is not found', async () => {
      Product.findByPk.mockResolvedValue(null);

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should return 500 status on error', async () => {
      Product.findByPk.mockRejectedValue(new Error('Database error'));

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products and 200 status', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 100, reward_type: 'A' },
        { id: 2, name: 'Product 2', price: 200, reward_type: 'B' }
      ];
      Product.findAll.mockResolvedValue(mockProducts);

      await productController.getAllProducts(req, res);

      expect(Product.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
    });

    it('should return 500 status on error', async () => {
      Product.findAll.mockRejectedValue(new Error('Database error'));

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});