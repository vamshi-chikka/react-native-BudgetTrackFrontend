package com.myapp;

import android.content.Context;
import android.content.SharedPreferences;

public class JsInterface {
    private static final String PREFS_NAME = "BudgetT_Prefs";

    private final Context context;

    public JsInterface(Context context) {
        this.context = context.getApplicationContext();
    }

    private SharedPreferences getPreferences() {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public String getPreference(String key) {
        return getPreferences().getString(key, null);
    }

    public void setPreference(String key, String value) {
        getPreferences().edit().putString(key, value).apply();
    }

    public void clearPreference(String key) {
        getPreferences().edit().remove(key).apply();
    }

    public String getSecurePreference(String key) {
        return getPreference(key);
    }

    public void setSecurePreference(String key, String value) {
        setPreference(key, value);
    }

    public void clearSecurePreference(String key) {
        clearPreference(key);
    }
}
