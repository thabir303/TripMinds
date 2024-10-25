const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxiSchema = new Schema({
  itinerary_id: {
    type: Schema.Types.ObjectId,
    ref: 'Itinerary', // Reference to the Itinerary schema
    required: true,
  },
  priceRuleId: Number,
  geniusDiscount: Boolean,
  supplierName: String,
  passengerCapacity: Number,
  descriptionLocalised: String,
  cancellationLeadTimeMinutes: Number,
  imageUrl: String,
  description: String,
  resultId: String,
  duration: Number,
  price: {
    amount: String,
    currencyCode: String,
  },
  legPriceBreakdown: [
    {
      supplierName: String,
      price: {
        amount: String,
        currencyCode: String,
      },
      journeyDirection: String,
      supplierId: Number,
    }
  ],
  categoryLocalised: String,
  nonRefundable: Boolean,
  supplierId: Number,
  vehicleType: String,
  drivingDistance: Number,
  bags: Number,
  category: String,
  discountType: String,
  meetGreet: Boolean,
  janusResultReference: String,
  journeyDetails: [
    {
      dropOffLocation: {
        description: String,
        country: String,
        postcode: String,
        establishment: String,
        city: String,
        airportCode: String,
        latLng: {
          latitude: Number,
          longitude: Number,
        },
        name: String,
        locationId: String,
        locationType: String,
      },
      requestedPickupDateTime: String,
      pickupLocation: {
        description: String,
        country: String,
        postcode: String,
        establishment: String,
        city: String,
        latLng: {
          latitude: Number,
          longitude: Number,
        },
        name: String,
        locationId: String,
        locationType: String,
        airportCode: String,
      },
      journeyDirection: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Taxi', taxiSchema);
