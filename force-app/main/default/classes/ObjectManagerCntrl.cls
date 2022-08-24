public with sharing class ObjectManagerCntrl {

    private static final List<ObjectInfo> OBJECT_INFOS = getObjects();

    @AuraEnabled
    public static List<ObjectInfo> getObjectsList(){
        return OBJECT_INFOS;
    }

    private static List<ObjectInfo> getObjects(){
        List<ObjectInfo> result = new List<ObjectInfo>();

        for(Schema.SObjectType sObjectType : Schema.getGlobalDescribe().values()){
            // exclude some standard objects
            // this is a POC only, please enhance for your use
            if (!sObjectType.getDescribe().isCustom()) {
                if (sObjectType.getDescribe().getName().endsWith('Share')) continue;
                if (sObjectType.getDescribe().getName().endsWith('ChangeEvent')) continue;
                if (sObjectType.getDescribe().getName().endsWith('Feed')) continue;
                if (sObjectType.getDescribe().getName().endsWith('History')) continue;
            }

            ObjectInfo objectInfo = new ObjectInfo();
            objectInfo.label = sObjectType.getDescribe().getLabel();
            objectInfo.pluralLabel = sObjectType.getDescribe().getLabelPlural();
            objectInfo.apiName = sObjectType.getDescribe().getName();
            objectInfo.type = sObjectType.getDescribe().isCustom() ? 'Custom Object' : 'Standard Object';
            result.add(objectInfo);
        }

        return result;
    }

    @AuraEnabled
    public static List<ObjectInfo> findObject(String keyword){
        List<ObjectInfo> result = new List<ObjectInfo>();

        for (ObjectInfo oi : OBJECT_INFOS){
            if ((oi.label != null && oi.label.containsIgnoreCase(keyword)) ||
                    (oi.pluralLabel != null && oi.pluralLabel.containsIgnoreCase(keyword)) ||
                    (oi.apiName != null && oi.apiName.containsIgnoreCase(keyword))){
                result.add(oi);
            }
        }

        return result;
    }

    public class ObjectInfo {

        @AuraEnabled
        public string label;

        @AuraEnabled
        public string pluralLabel;

        @AuraEnabled
        public string apiName;

        @AuraEnabled
        public string type;
    }

}