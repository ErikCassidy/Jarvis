using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;

public class OpenEventArgs
{
  public string type { get; }
  public int revenues { get; }
  public int expenses { get; }
  public OpenEventArgs(string type, int rev, int exp){
    this.type = type;
    this.revenues = rev;
    this.expenses = exp;
  }
}

public class SocketIOScript : MonoBehaviour {
  public delegate void OpenEventHandler(object sender, OpenEventArgs e);
  public event OpenEventHandler OpenEvent;

  protected string serverURL = "http://localhost:3000";
	protected Socket socket = null;

	void Destroy() {
		DoClose ();
	}

	// Use this for initialization
	void Start () {
		DoOpen ();
	}

	// Update is called once per frame
	void Update () {
	}

	void DoOpen() {
		if (socket == null) {
			socket = IO.Socket (serverURL);
			socket.On (Socket.EVENT_CONNECT, () => {
        // Connected
			});
			socket.On ("open", (data) => {
        string type = data.body.ToString();
        int revenue = data.revenues;
        int expenses = data.expenses;

        switch (type.ToLowerCase()) {
          case "revenue":
            OpenEvent(this, new OpenEventArgs("revenue"));
            break;
          case "expenses":
            OpenEvent(this, new OpenEventArgs("expenses"));
            break;
          case "statement": // income statement
            OpenEvent(this, new OpenEventArgs("income statement"));
          default:
            break;
        }
			});
		}
	}

	void DoClose() {
		if (socket != null) {
			socket.Disconnect ();
			socket = null;
		}
	}
}
