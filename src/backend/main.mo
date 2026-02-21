import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

actor {
  include MixinStorage();

  type WoundMeasurement = {
    id : Text;
    area : Float;
    perimeter : Float;
    circularity : Float;
    textureSmoothness : Float;
    edgeSharpness : Float;
    exudateLevel : Float;
    redPercentage : Float;
    pinkPercentage : Float;
    yellowPercentage : Float;
    blackPercentage : Float;
    image : Storage.ExternalBlob;
    diagnosis : Text;
    timestamp : Int;
  };

  module WoundMeasurement {
    public func fromTuple(tuple : (Text, WoundMeasurement)) : WoundMeasurement {
      tuple.1;
    };
  };

  type APIWoundMeasurement = {
    area : Float;
    perimeter : Float;
    circularity : Float;
    textureSmoothness : Float;
    edgeSharpness : Float;
    exudateLevel : Float;
    redPercentage : Float;
    pinkPercentage : Float;
    yellowPercentage : Float;
    blackPercentage : Float;
    image : Storage.ExternalBlob;
    timestamp : Int;
    diagnosis : Text;
  };

  func toAPIWoundMeasurement(measurement : WoundMeasurement) : APIWoundMeasurement {
    {
      area = measurement.area;
      perimeter = measurement.perimeter;
      circularity = measurement.circularity;
      textureSmoothness = measurement.textureSmoothness;
      edgeSharpness = measurement.edgeSharpness;
      exudateLevel = measurement.exudateLevel;
      redPercentage = measurement.redPercentage;
      pinkPercentage = measurement.pinkPercentage;
      yellowPercentage = measurement.yellowPercentage;
      blackPercentage = measurement.blackPercentage;
      image = measurement.image;
      timestamp = measurement.timestamp;
      diagnosis = measurement.diagnosis;
    };
  };

  let woundMeasurements = Map.empty<Text, WoundMeasurement>();

  public query ({ caller }) func getMeasurement(id : Text) : async ?APIWoundMeasurement {
    switch (woundMeasurements.get(id)) {
      case (null) { null };
      case (?measurement) {
        ?toAPIWoundMeasurement(measurement);
      };
    };
  };

  public query ({ caller }) func getAllMeasurements() : async [APIWoundMeasurement] {
    woundMeasurements.values().toArray().map(func(m) { toAPIWoundMeasurement(m) });
  };

  public shared ({ caller }) func measureWound(
    id : Text,
    image : Storage.ExternalBlob,
    area : Float,
    perimeter : Float,
    circularity : Float,
    textureSmoothness : Float,
    edgeSharpness : Float,
    exudateLevel : Float,
    redPercentage : Float,
    pinkPercentage : Float,
    yellowPercentage : Float,
    blackPercentage : Float,
  ) : async APIWoundMeasurement {
    if (woundMeasurements.containsKey(id)) {
      Runtime.trap("Measurement id " # id # " already exists");
    } else {
      let measurement : WoundMeasurement = {
        id;
        area;
        perimeter;
        circularity;
        textureSmoothness;
        edgeSharpness;
        exudateLevel;
        redPercentage;
        pinkPercentage;
        yellowPercentage;
        blackPercentage;
        image;
        timestamp = Time.now();
        diagnosis = "wound measurement";
      };
      woundMeasurements.add(id, measurement);
      toAPIWoundMeasurement(measurement);
    };
  };

  public shared ({ caller }) func deleteMeasurement(id : Text) : async () {
    switch (woundMeasurements.get(id)) {
      case (null) { Runtime.trap("Measurement id " # id # " does not exist") };
      case (?_) {
        woundMeasurements.remove(id);
      };
    };
  };
};
