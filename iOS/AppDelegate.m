/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"

#import "RCTPushNotificationManager.h"

#import <Parse/Parse.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>


@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  [Parse setApplicationId:@"zV50kkuGI8esJY0D6eAoy90bMgX3G2jWeTOTe1Rw"
                clientKey:@"HeijZwtl4a5uNo5yLTdBhHhe5keZ1bR2SfFaWYEi"];
  
  if ([application respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
    // iOS >= 8
    UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert |
                                                    UIUserNotificationTypeBadge |
                                                    UIUserNotificationTypeSound);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:userNotificationTypes
                                                                             categories:nil];
    [application registerUserNotificationSettings:settings];
    [application registerForRemoteNotifications];
  } else {
    // iOS < 8
    [application registerForRemoteNotificationTypes:
     (UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound)];
  }

  
  NSURL *scriptUrl = [NSURL URLWithString:@"http://google.com"];
  NSData *data = [NSData dataWithContentsOfURL:scriptUrl];
  if (data) {
    // load code from server
    
    // Loading JavaScript code - uncomment the one you want.
    
    // OPTION 1
    // Load from development server. Start the server from the repository root:
    //
    // $ npm start
    //
    // To run on device, change `localhost` to the IP address of your computer, and make sure your computer and
    // iOS device are on the same Wi-Fi network.
    //jsCodeLocation = [NSURL URLWithString:@"http://api_ios.notifsta.com/main.jsbundle"];
    jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/js/index.ios.bundle?dev=true"];
  } else {
    // OPTION 2
    // Load from pre-bundled file on disk. To re-generate the static bundle, run
    //
    // $ curl 'http://localhost:8081/js/index.ios.bundle?dev=false&minify=true' -o iOS/main.jsbundle
    //
    // and uncomment the next following line
    //
    //jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/js/index.ios.bundle"];

    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  }

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"NotifstaReact"
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                   didFinishLaunchingWithOptions:launchOptions];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  // Store the deviceToken in the current installation and save it to Parse.
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation setDeviceTokenFromData:deviceToken];
  currentInstallation.channels = @[ @"global" ];
  [currentInstallation saveInBackground];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  [RCTPushNotificationManager application:application didReceiveRemoteNotification:userInfo];
}

@end
