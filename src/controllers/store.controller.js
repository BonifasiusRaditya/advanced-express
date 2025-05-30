const storeRepository = require("../repository/store.repository");
const baseResponse = require("../utils/baseResponse");

exports.deleteStore = async (req, res) => {
    try {
        const store = await storeRepository.deleteStore(req.params.id);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store deleted", store);
    } catch (error) {
        baseResponse(res, false, 500, "Store not Found", error);
    }
};

exports.updateStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Missing store name or address", null);
    }
    try {
        const store = await storeRepository.updateStore(req.body);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store updated", store);
    } catch (error) {
        baseResponse(res, false, 500, "Store not Found", error);
    }
};

exports.getStoreByid = async (req, res) => {
    try {
        const store = await storeRepository.getStoredbyid(req.params.id);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store found", store);
    } catch (error) {
        baseResponse(res, false, 500, "Store not Found", error);
    }
};

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores found", stores);
    } catch (error) {
        baseResponse(res, false, 500, "Store not Found", error);
    }
};

exports.createStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Missing store name or address", null);
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "Store created", store);
    } catch (error) {
        baseResponse(res, false, 500, "Missing Store Name or Address" || "Server error", error);
    }
};