using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using SocketIO;
using WebSocketSharp;
using System.Text.RegularExpressions;

public class NewBehaviourScript : MonoBehaviour
{
    public class OpenEventArgs : MonoBehaviour
    {
        string type;
        public OpenEventArgs(string type) { this.type = type; }
    }

    public delegate void OpenEventHandler(object sender, OpenEventArgs e);
    public event OpenEventHandler OpenEvent;

    protected string serverURL = "http://localhost:3000";
    protected SocketIOComponent socket = null;

    public int Expenses;
    public int Revenues;

    void Destroy()
    {
        DoClose();
    }

    // Use this for initialization
    void Start()
    {
        DoOpen();
    }

    // Update is called once per frame
    void Update()
    {
    }

    void DoOpen()
    {
        if (socket == null)
        {
            //GameObject go = GameObject.Find("SocketIO");
            //socket = go.GetComponent<SocketIOComponent>();

            WebSocket socket = new WebSocket("ws://127.0.0.1:3000/socket.io/?EIO=4&transport=websocket");
            socket.OnOpen += Socket_OnOpen;
            socket.OnMessage += Socket_OnMessage;

            /*UnityEngine.Debug.Log("Go: " + go.ToString());
            UnityEngine.Debug.Log("Socket: " + socket.ToString());
            UnityEngine.Debug.Log(socket);

            socket.On("open", (SocketIOEvent e) =>
            {
                UnityEngine.Debug.Log("Socket opened");
            });
            /*  socket.On("alexa_open", (SocketIOEvent e) =>
              {
                  UnityEngine.Debug.Log("Ok.");
                  UnityEngine.Debug.Log(e);

                  string s = e.data.Print();
                  //UnityEngine.Debug.Log(s);

                  switch (s.ToLower())
                  {
                      case "revenue":
                          OpenEvent(this, new OpenEventArgs("revenue"));
                          break;
                      case "expenses":
                          OpenEvent(this, new OpenEventArgs("expenses"));
                          break;
                      case "statement": // income statement
                          OpenEvent(this, new OpenEventArgs("income statement"));
                          break;
                      default:
                          break;
                  }
              });

              socket.On("Revenues", (SocketIOEvent e) =>
              {
                  UnityEngine.Debug.Log("Revenues");
                  //UnityEngine.Debug.Log("Revenues are " + e.ToString());
              });

              socket.On("Expenses", (expenses) =>
              {
                  UnityEngine.Debug.Log("Expenses are " + expenses);
                  Expenses = (int)expenses.data.f;
              });*/

            socket.Connect();
        }
    }

    private void Socket_OnMessage(object sender, MessageEventArgs e)
    {
        string data = e.Data.ToString();
        if(e.Data.Equals("42[\"alexa_open\",\"revenue\"]"))
        {
            UnityEngine.Debug.Log("Alexa_open Revenue");
        }else if (e.Data.Equals("42[\"alexa_open\",\"expenses\"]"))
        {
            UnityEngine.Debug.Log("Alexa_open Expenses");
        }
    }

    private void Socket_OnOpen(object sender, System.EventArgs e)
    {
        UnityEngine.Debug.Log("Connected");
    }

    void DoClose()
    {
        if (socket != null)
        {
            socket.Close();
            socket = null;
        }
    }
}