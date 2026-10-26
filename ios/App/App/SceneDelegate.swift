import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    private var privacyCover: UIView?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = CAPBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }

    // Cases hold health and money details, so hide them from the app switcher snapshot.
    func sceneWillResignActive(_ scene: UIScene) {
        guard let window = window, privacyCover == nil else { return }
        let cover = UIView(frame: window.bounds)
        cover.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        cover.backgroundColor = UIColor(red: 246 / 255, green: 244 / 255, blue: 239 / 255, alpha: 1)
        let logo = UIImageView(image: UIImage(named: "Splash"))
        logo.contentMode = .scaleAspectFit
        logo.frame = cover.bounds
        logo.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        cover.addSubview(logo)
        window.addSubview(cover)
        privacyCover = cover
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        privacyCover?.removeFromSuperview()
        privacyCover = nil
    }
}
