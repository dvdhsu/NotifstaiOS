#import "FacebookLoginManager.h"
#import "FBSDKCoreKit/FBSDKCoreKit.h"
#import "FBSDKLoginKit/FBSDKLoginKit.h"


@implementation FacebookLoginManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(logout) {
  [[[FBSDKLoginManager alloc] init] logOut];
};

RCT_EXPORT_METHOD(newSession:(RCTResponseSenderBlock)callback) {

  FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
  [login logInWithReadPermissions:@[@"public_profile", @"email"] handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
    
    if (error) {
      callback(@[@"Error", [NSNull null]]);
    } else if (result.isCancelled) {
      callback(@[@"Canceled", [NSNull null]]);
    } else {
      FBSDKAccessToken *token = result.token;
      NSString *tokenString = token.tokenString;
      NSString *userId = token.userID;
      [[[FBSDKGraphRequest alloc] initWithGraphPath:@"me" parameters:nil]
       startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {
         if (!error) {
           NSString *email= [result objectForKey:@"email"];
           NSString *firstName= [result objectForKey:@"first_name"];
           NSString *lastName= [result objectForKey:@"last_name"];
           NSString *gender= [result objectForKey:@"gender"];
           NSDictionary *credentials = @{ @"token" : tokenString, @"userId" : userId, @"gender" : gender,
                                          @"email" : email, @"firstName" : firstName, @"lastName" : lastName };
           callback(@[[NSNull null], credentials]);
         }
       }];
    }
  }];
};

@end