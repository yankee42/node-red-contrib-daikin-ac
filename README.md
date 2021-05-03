# node-red-contrib-daikin-ac

This is a small wrapper for [daikin-controller](https://github.com/Apollon77/daikin-controller) so that Daikin air
conditions can be easily controlled using [NodeRED](https://nodered.org/).

# Usage

- Add the function node `daikin-controller` to a flow
- Configure host name and possibly options for the A/C
- In the `daikin-contoller`-node either select the method from the library `daikin-controller` that you'd like to call or set the method name using `message.topic`.
- If the node `daikin-controller` receives a message, it will call the appropriate method of the library. If the target method receives two arguments, the payload will be passed as first argument. A callback will automatically be passed as second argument and the result returned by that callback will be used to generate a new message from this node.

See the documentation of [daikin-controller](https://github.com/Apollon77/daikin-controller) for details on what you can do.

# Example

Configure an inject mode like this and feed the message into `daikin-controller` to set the target temperature to 22°C:
![screenshot of inject node](doc/inject-set-temp.png)

# Contributions

Contributions are welcome. Contributions containing unit tests are even more welcome.

# License

[MPL 2.0](LICENSE.txt)
