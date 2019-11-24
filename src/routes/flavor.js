import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('flavor');
const {
  DataSupplier,
  Flavor,
  FlavorIdentifier,
  UserFlavorNote,
  UserProfile,
  Vendor
} = models;

/**
 * GET Flavor by ID
 * @param id int
 */
router.get(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    log.info(`request for ${id}`);
    try {
      const result = await Flavor.findOne({
        where: {
          id
        },
        include: [
          {
            model: Vendor,
            require: true
          }
        ]
      });

      if (!result) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * POST Create a Flavor
 * @body vendorId int
 * @body name string
 * @body slug string
 * @body density decimal
 */
router.post(
  '/',
  authenticate(),
  [
    body('vendorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('slug')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('density').isDecimal()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { vendorId, name, slug, density } = req.body;

    log.info(`request for new flavor`);
    try {
      const result = await Flavor.create({
        vendorId,
        name,
        slug,
        density
      });

      if (result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * PUT Updates a Flavor
 * @param id int
 * @body vendorId int
 * @body name string
 * @body slug string
 * @body density decimal
 */
router.put(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('vendorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('name')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('slug')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length'),
    body('density').isDecimal()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { vendorId, name, slug, density } = req.body;

    log.info(`request to update flavor id ${id}`);
    try {
      const result = await Flavor.update(
        {
          vendorId,
          name,
          slug,
          density
        },
        {
          where: {
            id
          }
        }
      );

      if (result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * DELETE Deletes a Flavor
 * @param id int
 */
router.delete(
  '/:id',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    log.info(`request to delete flavor id ${id}`);
    try {
      const result = await Flavor.destroy({
        where: {
          id
        }
      });

      if (result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * GET Flavor Data Supplier Identifiers
 * @param id int
 */
router.get(
  '/:flavorId/identifiers',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { flavorId } = req.params;

    log.info(`request for flavor id ${flavorId} identifiers`);
    try {
      const result = await FlavorIdentifier.findAll({
        where: {
          flavorId
        },
        include: [
          {
            model: DataSupplier,
            require: true
          }
        ]
      });

      if (!Array.isArray(result) || result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * GET Flavor Data Supplier Identifier
 * @param flavorId int
 * @param dataSupplierId int
 */
router.get(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { flavorId, dataSupplierId } = req.params;

    log.info(
      `request for flavor id ${flavorId} data supplier id ${dataSupplierId} identifer`
    );
    try {
      const result = await FlavorIdentifier.findOne({
        where: {
          flavorId,
          dataSupplierId
        },
        include: [
          {
            model: DataSupplier,
            require: true
          }
        ]
      });

      if (!result) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * POST Create a Flavor Identifier
 * @param id int
 * @param dataSupplierId int
 * @body identifier string
 */
router.post(
  '/:flavorId/identifier',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('identifier')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { flavorId } = req.params;
    const { dataSupplierId, identifier } = req.body;

    log.info(`request for new flavor identifier for flavor id ${flavorId}`);
    try {
      const result = await FlavorIdentifier.create({
        flavorId,
        dataSupplierId,
        identifier
      });

      if (result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * PUT Update a Flavor Identifier
 * @param flavorId int
 * @param dataSupplierId int
 * @body identifier string
 */
router.put(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('identifier')
      .isString()
      .isLength({ min: 1 })
      .withMessage('length')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { flavorId, dataSupplierId } = req.params;
    const { identifier } = req.body;

    log.info(
      `request to update flavor id ${flavorId} identifier id ${dataSupplierId}`
    );
    try {
      const result = await FlavorIdentifier.update(
        {
          identifier
        },
        {
          where: {
            flavorId,
            dataSupplierId
          }
        }
      );

      if (result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);
/**
 * Delete Diluent
 * @param flavorId int
 * @param dataSupplierId int
 */
router.delete(
  '/:flavorId/identifier/:dataSupplierId',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('dataSupplierId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { flavorId, dataSupplierId } = req.params;

    log.info(
      `request to delete flavor id ${flavorId} identifier id ${dataSupplierId}`
    );
    try {
      const result = await FlavorIdentifier.destroy({
        where: {
          flavorId,
          dataSupplierId
        }
      });

      if (!result || result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

/**
 * GET Flavor Notes
 * @param id int
 */
router.get(
  '/:flavorId/notes',
  authenticate(),
  [
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { flavorId } = req.params;

    log.info(`request for flavor id ${flavorId} notes`);
    try {
      const result = await UserFlavorNote.findAll({
        where: {
          flavorId
        },
        include: [
          {
            model: Flavor,
            require: true
          },
          {
            model: UserProfile,
            require: true
          }
        ]
      });

      if (!Array.isArray(result) || result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

export default router;
