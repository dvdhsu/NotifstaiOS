# import "PushSubscriptionManager.h"
#import <Parse/Parse.h>

@implementation PushSubscriptionManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(pushSubscribe:(NSString *)channel_id) {
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation addUniqueObject:channel_id forKey:@"channels"];
  [currentInstallation saveInBackground];
}

RCT_EXPORT_METHOD(pushUnsubscribe:(NSString *)id) {
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation removeObject:id forKey:@"channels"];
  [currentInstallation saveInBackground];
}

@end
