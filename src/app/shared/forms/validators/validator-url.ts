import { FormControl } from '@angular/forms';

export class ValidatorUrl {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    if (!c.value) {
      return null;
    } else if (!urlValid) {
      return { validateUrl: true };
    }
    return null;
  }

  static testUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/\S+[^ \.]{3}\/?)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      value,
    );
  }
}

export class ValidatorUrlInstagram {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlValidInstagram = ValidatorUrlInstagram.urlInstagram(c.value);
    if (!c.value) {
      return null;
    } else if (!urlValidInstagram || !urlValid) {
      return { validateUrlInstagram: true };
    }
    return null;
  }

  static urlInstagram(url) {
    return /(https?)?:?(www)?instagram\.com\/[a-z]/.test(url);
  }
}

export class ValidatorUrlIfood {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlValidIfood = ValidatorUrlIfood.urlIfood(c.value);
    if (!c.value) {
      return null;
    } else if (!urlValidIfood || !urlValid) {
      return { validateUrlIfood: true };
    }
    return null;
  }

  static urlIfood(url) {
    return /https:\/\/www\.ifood\.com\.br\/delivery\/[^\/]+\/[^\/]+\/[^\/]+/.test(
      url,
    );
  }
}

export class ValidatorUrlRappi {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlValidRappi = ValidatorUrlRappi.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlValidRappi || !urlValid) {
      return { validateUrlRappi: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /(?:https\:\/\/www\.rappi\.com\.br\/)/.test(url);
  }
}

export class ValidatorUrlUbereats {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlValidUbereats = ValidatorUrlUbereats.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlValidUbereats || !urlValid) {
      return { validateUrlUbereats: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /(?:.+)(?:ubereats\.)(?:.+)(?:)food-delivery/.test(url);
  }
}

export class ValidatorUrlDelivery {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlDelivery = ValidatorUrlDelivery.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (urlDelivery || !urlValid) {
      return { validateUrlDelivery: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /(rappi)|(ifood)|(ubereats)|(instagram)|(facebook)/.test(url);
  }
}

export class ValidatorUrlDeliverymuch {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlDeliverymuch = ValidatorUrlDeliverymuch.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlDeliverymuch || !urlValid) {
      return { validateUrlDeliverymuch: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /https:\/\/(www\.)?deliverymuch\.com\.br\/inicio\/[^\/]+\/[^\/]+\/[^\/]+/.test(
      url,
    );
  }
}

export class ValidatorUrlDeliverydireto {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlDeliverydireto = ValidatorUrlDeliverydireto.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlDeliverydireto || !urlValid) {
      return { validateUrlDeliverydireto: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /(?:https\:\/\/(www\.)?deliverydireto\.com\.br\/)/.test(url);
  }
}

export class ValidatorUrlTrinks {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlTrinks = ValidatorUrlTrinks.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlTrinks || !urlValid) {
      return { validateUrlTrinks: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /(?:https\:\/\/www\.trinks\.com\/)/.test(url);
  }
}

export class ValidatorUrlGoomergo {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlGoomergo = ValidatorUrlGoomergo.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlGoomergo || !urlValid) {
      return { validateUrlGoomergo: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /^(https?:\/\/)?(www\.)?([\w-]+\.)?goomer\.app/.test(url);
  }
}

export class ValidatorUrlMenudino {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlMenudino = ValidatorUrlMenudino.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlMenudino || !urlValid) {
      return { validateUrlMenudino: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /(?:https\:\/\/app\.menudino\.com\/)/.test(url);
  }
}

export class ValidatorUrlMenew {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlMenew = ValidatorUrlMenew.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlMenew || !urlValid) {
      return { validateUrlMenew: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /(?:https\:\/\/(www\.)?delivery\.menew\.com\.br\/)/.test(url);
  }
}

export class ValidatorUrlShipp {
  static validator(c: FormControl) {
    const urlValid = ValidatorUrl.testUrl(c.value);
    const urlShipp = ValidatorUrlShipp.urlIValidator(c.value);
    if (!c.value) {
      return null;
    } else if (!urlShipp || !urlValid) {
      return { validateUrlShipp: true };
    }
    return null;
  }

  static urlIValidator(url) {
    return /^(https?:\/\/)?(www\.)?shipp\.delivery/.test(url);
  }
}
