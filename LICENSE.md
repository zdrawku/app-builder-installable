# License management from indigodesigned

**Note**:
> This specification is not up to date, it was created before the actual implementation.

[Check the wiki for more info](http://mon-indigo.infragistics.local:81/licensing-and-versioning/Everything%20you%20need%20to%20know%20about%20licensing)

## Activate Trial

```
Receive auth token & username & Indigo Studio version
Get the indigodesigned user
Active trial with CRM using a Pro SKU.
If activation failed:
    // Activation might fail because of lack of CRM support or CRM not available
    If user has expired trial && trial major >= indigo studio version major:
        return trial expired
    else if user has ongoing trial:
        return trial ongoing
    else:
        Create { trial, version, user, expirationDate }
else:
    return active trial
```

# Validate License

```
Receive IG username/password (or auth token), optional: indigo studio version, perpetual license, ignore perpetual license
Validate IG username/password and resolve customer Id & auth provider (en/jp) (or resolve auth token)
If not authenticated:
    return 401.
Get the indigodesigned user.

If perpetual license:
    Store last perpetual license and indigo studio version
    return { tier: Pro, subscription: Perpetual }

if last perpetual license available:
    return { tier: Pro, subscription: Perpetual }

If indigodesigned user license override:
    return { tier, subscription }

Get latest Contract for username (or customer Id?).
If failed:
    If last contract available:
        return last contract license.

If no Contract:
    // Only needed if JP not available
    // If indigodesigned active trial:
    //    return { tier: Pro, subscription: Trial, expirationDate }

    if user existed before 16.2:
        return { tier: Pro, subscription: Perpetual }
    else
        return { tier: Free (ex Essential), subscription: None }
else:
    if Contract canceled or expired:
        return { tier: Free (ex Essential), subscription: None }
    else:
        return Contract license.

// Missing:
Check academic license.

// Japanese:
If browser is locale jp, check first japanese service
Will have start trial (same service, different endpoint)
but no monthly subscription
```
