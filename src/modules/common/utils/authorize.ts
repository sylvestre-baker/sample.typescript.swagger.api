import passport = require('passport');
import express = require('express');

export function authorize(): express.Handler {
    return passport.authenticate('bearer', { session: false });
}

export function authorizeAdmin(): express.Handler {
    return passport.authenticate('bearer-admin', { session: false });
}