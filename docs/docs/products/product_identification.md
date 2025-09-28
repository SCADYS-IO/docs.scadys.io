# Product Identification

SCADYS.IO products are identified using a structured coding scheme that applies across labels, serial numbers, PCBs, packaging, documentation, and inventory. This scheme ensures traceability from component to finished product.

## SKU (Variant Code)

Every product variant is assigned a unique SKU code—also referred to as the *Variant Code*. This code identifies the exact configuration of a product, including:

* product family;
* hardware version;
* feature set;
* colour; and
* product tier (Prototype, PCB Kit, Build Kit or Retail)

The format is `[ProductCode]-v[Major].[Minor]-[FeatureCode]-[ColorCode]-[TierCode]`.

!!! example "`03-v1.0-CAN-BLK-P`"  
    - Product:        CANBench Duo (`03`)    
    - Version:        1.0    
    - Feature set:    CAN-enabled   
    - Colour:         Satin Black    
    - Tier:           Prototype

Each SKU is defined in the internal `ProductVariants` register, where its associated metadata (GTIN, label template, compliance status, etc.) is maintained.

## Serial Numbers

Individual units are assigned sequential serial numbers during production. The full serial number format is `[6-digit Serial]-[MMYY]-[VariantCode]`.

!!! example "`001578-0825-03-v1.0-CAN-BLK-P`"   
    
    This identifies a black CANBench DC-LISN with the CAN option, serial #1578, assembled as a prototype in August 2025.

Serial numbers appear on:

* shipping labels;
* device markings;
* certification records; and/or
* warranty/service records.

## Model Numbers and PCB Codes

For assemblies and components such as PCBs, abbreviated model numbers may be used. These are derived from the SKU format, omitting attributes not relevant at the assembly level (e.g. colour or tier).

For example:

* `03-v1.0-CAN` may be used on the PCB silkscreen
* A full retail device label will use `03-v1.0-CAN-BLK-C`

The SKU register governs all such identifiers.

## Lookup and Validation

If you are unsure of the meaning of a SKU or serial number:

* cross-reference it in the internal `Product Variants` list;
* refer to the label template linked to that variant; or
* contact the manufacturing coordinator for clarification.

All SKUs and serials are maintained in the SCADYS.io SharePoint portal and exported via Excel for label generation and traceability reporting.
