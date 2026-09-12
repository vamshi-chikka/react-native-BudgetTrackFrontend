package com.myapp;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class Jbridge extends ReactContextBaseJavaModule {
    private final JsInterface jsInterface;

    public Jbridge(ReactApplicationContext reactContext) {
        super(reactContext);
        this.jsInterface = new JsInterface(reactContext);
    }

    @Override
    public String getName() {
        return "Jbridge";
    }

    @ReactMethod
    public void setPreference(String key, String value, Promise promise) {
        try {
            jsInterface.setPreference(key, value);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("JBRIDGE_SET_PREFERENCE", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void getPreference(String key, Promise promise) {
        try {
            String value = jsInterface.getPreference(key);
            promise.resolve(value);
        } catch (Exception e) {
            promise.reject("JBRIDGE_GET_PREFERENCE", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void clearPreference(String key, Promise promise) {
        try {
            jsInterface.clearPreference(key);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("JBRIDGE_CLEAR_PREFERENCE", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void setSecurePreference(String key, String value, Promise promise) {
        try {
            jsInterface.setSecurePreference(key, value);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("JBRIDGE_SET_SECURE_PREFERENCE", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void getSecurePreference(String key, Promise promise) {
        try {
            String value = jsInterface.getSecurePreference(key);
            promise.resolve(value);
        } catch (Exception e) {
            promise.reject("JBRIDGE_GET_SECURE_PREFERENCE", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void clearSecurePreference(String key, Promise promise) {
        try {
            jsInterface.clearSecurePreference(key);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("JBRIDGE_CLEAR_SECURE_PREFERENCE", e.getMessage(), e);
        }
    }
}
