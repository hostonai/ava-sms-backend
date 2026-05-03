const carriers = {
  alliant: {
    idPhone: '1 (866) 403-2785',
    paymentPhone: '1 (800) 811-4793',
    searchUrl: 'https://idirectory.alliantplans.com/ProviderSearch/Home/SearchFilter?network=HealthOne+Alliance',
    portalUrl: 'https://alliantplans.com/'
  },
  ambetter: {
    idPhone: '1 (877) 687-1180',
    paymentPhone: '(877) 687-1180',
    searchUrl: 'https://my.ambetterhealth.com/x/findaprovider/marketplace/en/default/location',
    portalUrl: 'https://my.ambetterhealth.com/'
  },
  anthem: {
    idPhone: '1 (855) 738-6652',
    paymentPhone: '(855) 738-6652',
    searchUrl: 'https://www.anthem.com/find-care/',
    portalUrl: 'https://www.anthem.com/'
  },
  caresource: {
    idPhone: '1 (833) 230-2099',
    paymentPhone: '(833) 230-2099',
    searchUrl: 'https://findadoctor.caresource.com/step1?sort=Relevance&direction=ASC',
    portalUrl: 'https://www.caresource.com/'
  },
  cigna: {
    idPhone: '(866) 494-2111',
    paymentPhone: '(877) 484-5967',
    searchUrl: 'https://hcpdirectory.cigna.com/web/public/consumer/directory/search',
    portalUrl: 'https://www.cigna.com/'
  },
  kaiser: {
    idPhone: '1 (800) 558-6350',
    paymentPhone: '(877) 699-7407',
    searchUrl: 'https://healthy.kaiserpermanente.org/doctors-locations',
    portalUrl: 'https://healthy.kaiserpermanente.org/'
  },
  oscar: {
    idPhone: '(855) 672-2788',
    paymentPhone: '(855) 672-2788',
    searchUrl: 'https://www.hioscar.com/search/networks/',
    portalUrl: 'https://www.hioscar.com/'
  },
  uhc: {
    idPhone: '(800) 609-9754',
    paymentPhone: '(800) 609-9754',
    searchUrl: 'https://www.uhc.com/find-a-doctor',
    portalUrl: 'https://member.uhc.com/ifp/prelogin'
  },
  dentaquest: {
    idPhone: '1-844-876-3982',
    paymentPhone: '1-844-876-3982',
    searchUrl: null,
    portalUrl: null
  }
};

const sopMessages = {
  idcard: (carrier, data) => {
    const capitalized = carrier.charAt(0).toUpperCase() + carrier.slice(1);
    return `${capitalized} ID Card: Call ${data.idPhone} or log into ${data.portalUrl} to download`;
  },
  pharmacy: () => {
    return `Prescription Discount Card: https://www.hostonhelps.com/resources`;
  },
  payment: (carrier, data) => {
    return `Pay your ${carrier.charAt(0).toUpperCase() + carrier.slice(1)} premium: Call ${data.paymentPhone}`;
  },
  paymenthealthsherpa: () => {
    return `Pay your premium here: https://www.healthsherpa.com/micropayages/eEwPQ7TruwI?utm_campaign=ezpayemail-consumer&utm_medium=email`;
  },
  network: (carrier, data) => {
    const capitalized = carrier.charAt(0).toUpperCase() + carrier.slice(1);
    return `Search ${capitalized} in-network doctors: ${data.searchUrl}`;
  },
  claims: (carrier, data) => {
    const capitalized = carrier.charAt(0).toUpperCase() + carrier.slice(1);
    return `${capitalized} Member Services: ${data.idPhone} — reference your claim number and they'll explain the denial`;
  },
  doctor: (carrier, data) => {
    const capitalized = carrier.charAt(0).toUpperCase() + carrier.slice(1);
    return `Have your doctor's office call ${capitalized} Member Services: ${data.idPhone} — they'll verify coverage together`;
  },
  benefits: (carrier, data) => {
    const capitalized = carrier.charAt(0).toUpperCase() + carrier.slice(1);
    return `${capitalized} Member Services: ${data.idPhone} — ask about unused benefits and refunds`;
  },
  dashboard: () => {
    return `View your coverage and payment status: https://www.healthsherpa.com/sessions/new?_agent_id=hoston_fannings`;
  }
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sopType, carrier } = req.body;

  if (!sopType || !carrier) {
    return res.status(400).json({ error: 'sopType and carrier are required' });
  }

  const carrierKey = carrier.toLowerCase();
  const carrierData = carriers[carrierKey];

  if (!carrierData) {
    return res.status(400).json({ error: `Carrier '${carrier}' not found` });
  }

  const messageFunction = sopMessages[sopType];
  if (!messageFunction) {
    return res.status(400).json({ error: `SOP type '${sopType}' not found` });
  }

  try {
    const message = messageFunction(carrierKey, carrierData);
    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
