# Sahur Connect troubleshooting

A Sahur Connect connection goes through four parts, in this order:

1. **This device** reaches Sahur Connect over the internet.
2. **Sahur Connect** checks your sign-in and the host's link.
3. **The host's tunnel** (cloudflared on the host) carries the request to the host.
4. **Tung Tung Tung Code on the host** answers.

When a connection fails, open **Settings > Environments**, find the environment,
and select **Details**. The first part marked as failed is the cause. Find its
section below.

To see the host's side, run `t3 connect status` on the host, or open
**Settings > Sharing & access** on the host. Both check the host's Sahur Connect
address from the host, and say why it fails. `t3 connect` runs the same check
when it finishes setup. This check cannot test another device's network. For a
problem on one device, use **Details** on that device.

## The host's tunnel is offline

Sahur Connect could not reach the host's tunnel. This means one of these:

- The host is asleep, turned off, or offline.
- Tung Tung Tung Code is not running on the host.
- The host's network blocks the tunnel. See
  [Port 7844 is blocked on the host](#port-7844-is-blocked-on-the-host).

Fix:

1. Make sure the host is awake and Tung Tung Tung Code runs on it.
2. On the host, run `t3 connect status`. It names the problem on the host's side.
3. If the host was offline for a long time, Sahur Connect removes its tunnel. Start
   Tung Tung Tung Code on the host and update it to the latest version. It gets a new tunnel.

## Port 7844 is blocked on the host

The tunnel on the host connects out to Cloudflare on port 7844, with TCP and
UDP. Both tunnel protocols (QUIC and HTTP/2) use this port. When the host's
network blocks it, the tunnel cannot start, but normal web traffic still works.
The host looks online, so this problem is easy to miss.

Common causes:

- **A Tailscale exit node on the host.** All of the host's internet traffic goes
  through the exit node, and that network blocks port 7844. Turn off the exit
  node on the host with `tailscale set --exit-node=`, or allow outbound port
  7844 on the exit node's network.
- **A VPN on the host.** Work VPNs often block unknown ports. Ask for port 7844
  to be allowed, or use a direct route instead (see below).
- **A firewall or strict network.** Allow outbound TCP and UDP port 7844.

If you cannot unblock the port, you can connect without Sahur Connect. When the
host and this device are on the same Tailscale network, add the host's
Tailscale address as a direct route. See
[Reach one machine several ways](./remote-access.md#reach-one-machine-several-ways).

<a id="the-tunnel-works-but-t3-code-does-not-answer"></a>

## The tunnel works, but Tung Tung Tung Code does not answer

The host's tunnel is up, but it cannot reach Tung Tung Tung Code on the host. Common causes:

- Tung Tung Tung Code on the host stopped, crashed, or is still starting.
- Tung Tung Tung Code restarted on a different port, for example after an update, and the
  tunnel still points at the old port.
- The server binds only one network address with `T3CODE_HOST`. The tunnel
  sends requests to `127.0.0.1`, so the server must also listen there.

Fix: restart Tung Tung Tung Code on the host. For the background service, run
`t3 service restart`. Then run `t3 connect status` on the host.

<a id="the-t3-connect-address-does-not-resolve-or-answer"></a>

## The Sahur Connect address does not resolve or answer

The host's Sahur Connect address did not resolve, refused the connection, failed a
secure (TLS) connection, or did not answer in time.

Fix:

1. Make sure the host is awake and online.
2. On the host, run `t3 connect status`.
3. If the check fails only on the host, check the host's DNS, VPN, or proxy.

<a id="this-device-cant-reach-t3-connect"></a>

## This device can't reach Sahur Connect

The problem is on this device's network, not on the host. This device could
not reach Sahur Connect, or it reached Sahur Connect but not the host's tunnel
address.

Fix:

1. Check this device's internet connection. On a captive or dead Wi-Fi network,
   the device can look online but cannot reach anything.
2. A VPN, firewall, ad blocker, or DNS filter on this device can block Sahur
   Connect. Turn it off for a moment to test.
3. On iPhone, Connectivity Assist in the Wi-Fi settings can break Sahur Connect.
   Turn it off to test.
4. Try another network, or add a direct route to the host, such as its
   Tailscale address. See
   [Reach one machine several ways](./remote-access.md#reach-one-machine-several-ways).

## Sign-in, account, or link problems

Sahur Connect does not have an active link between your account and the host.

- **The host is linked to a different account.** Sign in to the same Sahur Connect
  account on this device and on the host. On the host, run `t3 connect logout`,
  then `t3 connect`.
- **Sahur Connect is off on the host, or the host only publishes agent activity.**
  On the host, open **Settings > Sharing & access** and turn **Sahur Connect** on, or
  run `t3 connect`.
- **The host was linked, but the server did not apply the link yet.** Run
  `t3 service restart` on the host, or restart `t3 serve`.
- **This device's sign-in expired, or the host no longer accepts this
  device.** Sign out of Sahur Connect and sign in again.
- **Your account reached its tunnel limit.** Remove an environment you do not
  use from your Tung Tung Tung Code account's Sahur Connect page, then restart Tung Tung Tung Code on the host.

## The clock is off

Sahur Connect signs requests with short-lived proofs. When the clock on this
device or the host is a few minutes wrong, Sahur Connect rejects them. Turn on
automatic date and time on both devices, then retry.

<a id="the-host-runs-an-older-t3-code"></a>

## The host runs an older Tung Tung Tung Code

This app needs a newer Tung Tung Tung Code on the host. Update Tung Tung Tung Code on the host. See
[Updating Tung Tung Tung Code](./updating.md).

<a id="t3-connect-returned-an-error"></a>

## Sahur Connect returned an error

| Error                                                     | Fix                                                                                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `environment_link_limit_exceeded` or managed tunnel limit | Remove an unused environment, then restart Tung Tung Tung Code on the host.                                                                 |
| `auth_invalid` or `invalid_bearer`                        | Run `t3 connect login`. If credentials were revoked, run `t3 connect logout`, then `t3 connect` again. Restart the server after signing in. |
| Expired or invalid link proof                             | Check the host's date and time, update Tung Tung Tung Code, then restart it.                                                                |
| HTTP 403 without a recognized error                       | Check relay access, proxies, and firewall rules. Keep any Cloudflare Ray ID for a bug report.                                               |
| HTTP 408, 429, or 5xx                                     | Wait a few minutes. Tung Tung Tung Code retries temporary failures on its own.                                                              |

After you fix a permanent rejection, restart the host's server with
`t3 service restart`. For a foreground server, stop it and run `t3 serve` again.

If Tung Tung Tung Code on the host disappears when SSH closes, see
[background-service troubleshooting](./background-service.md#troubleshooting).

## Report a problem

If none of this helps, open an issue on
[GitHub](https://github.com/pingdotgg/t3code/issues). Include:

- The text from **Copy diagnostics** in the environment's **Details**.
- The output of `t3 connect status` on the host.
- The trace ID, if one is shown.
