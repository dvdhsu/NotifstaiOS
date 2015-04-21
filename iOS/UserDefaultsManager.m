# import "UserDefaultsManager.h"

@implementation UserDefaultsManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(storeString:(NSString *)key value:(NSString *)value) {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:value forKey:key];
  [defaults synchronize];
}

RCT_EXPORT_METHOD(removeKey:(NSString *)key) {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults removeObjectForKey:key];
}

RCT_EXPORT_METHOD(getDoubleString:(NSString *)key1 key2:(NSString *)key2 callback:(RCTResponseSenderBlock)callback) {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *res1 = [defaults objectForKey:key1];
  NSString *res2 = [defaults objectForKey:key2];

  if (res1 == nil || res2 == nil) {
    callback(@[@"key not found", [NSNull null]]);
    NSLog(@"key not found");
  }
  else {
    callback(@[[NSNull null], @[res1, res2]]);
  }
}

@end
