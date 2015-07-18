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

RCT_EXPORT_METHOD(getString:(NSString *) key callback:(RCTResponseSenderBlock)callback) {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *res = [defaults objectForKey:key];
  if (res == nil) {
    callback(@[@"key not found", [NSNull null]]);
    NSLog(@"key not found");
  }
  else {
    callback(@[[NSNull null], res]);
  }
}

@end
