import React from "react";
import logo from "./logo.svg";
import "./App.css";

window.API = {
  fetchFriends() {
    return new Promise((res, rej) => {
      const friends = [
        {
          name: "Chandler",
          active: true,
        },
        {
          name: "Joey",
          active: true,
        },
        {
          name: "Rachel",
          active: true,
        },
        {
          name: "Pheobe",
          active: true,
        },
        {
          name: "Monica",
          active: true,
        },
        {
          name: "Ross",
          active: true,
        },
        {
          name: "Gunther",
          active: false,
        },
        {
          name: "Janice",
          active: false,
        },
      ];

      setTimeout(() => res(friends), 2000);
    });
  },
};

class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "Loading",
    };
  }
  componentDidMount() {
    const stopper = this.state.text + "...";

    this.interval = window.setInterval(() => {
      this.state.text === stopper
        ? this.setState(() => ({ text: "Loading" }))
        : this.setState((prevState) => ({ text: prevState.text + "." }));
    }, 300);
  }
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }
  render() {
    return <p>{this.state.text}</p>;
  }
}

function ActiveFriends(props) {
  return (
    <div>
      <h2>Active Friends</h2>
      <ul>
        {props.list.map((friend) => (
          <li key={friend.name}>
            <span>{friend.name}</span>
            <button onClick={() => props.onRemoveFriend(friend.name)}>
              Remove
            </button>
            <button onClick={() => props.onToggleFriend(friend.name)}>
              Deactivate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InactiveFriends(props) {
  return (
    <div>
      <h2>Inactive Friends</h2>
      <ul>
        {props.list.map((friend) => (
          <li key={friend.name}>
            <span>{friend.name}</span>
            <button onClick={() => props.onToggleFriend(friend.name)}>
              Activate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      input: "",
      loading: true,
    };
    this.handleRemoveFriend = this.handleRemoveFriend.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this);
    this.handleToggleFriend = this.handleToggleFriend.bind(this);

    console.log("--constructor--");
  }
  componentDidMount() {
    console.log("--componentDidMount--");
    window.API.fetchFriends().then((friends) => {
      this.setState({
        friends,
        loading: false,
      });
    });
  }
  componentDidUpdate() {
    console.log("--componentDidUpdate--");
  }
  componentWillUnmount() {
    console.log("--componentWillUnmount--");
  }
  handleAddFriend() {
    this.setState((currentState) => {
      return {
        friends: currentState.friends.concat([
          {
            name: this.state.input,
            active: true,
          },
        ]),
        input: "",
      };
    });
  }
  handleRemoveFriend(name) {
    this.setState((currentState) => {
      return {
        friends: currentState.friends.filter((friend) => friend.name !== name),
      };
    });
  }
  handleToggleFriend(name) {
    this.setState((currentState) => {
      const friend = currentState.friends.find(
        (friend) => friend.name === name
      );
      return {
        friends: currentState.friends
          .filter((friend) => friend.name !== name)
          .concat([
            {
              name,
              active: !friend.active,
            },
          ]),
      };
    });
  }
  updateInput(e) {
    const value = e.target.value;
    this.setState({
      input: value,
    });
  }
  render() {
    console.log("--render--");

    if (this.state.loading === true) {
      return <Loading />;
    }

    return (
      <div>
        <input
          type="text"
          placeholder="new friend"
          value={this.state.input}
          onChange={this.updateInput}
        />
        <button onClick={this.handleAddFriend}>Submit</button>
        <div>
          <button
            onClick={() =>
              this.setState({
                friends: [],
              })
            }
          >
            Clear All
          </button>
        </div>
        <ActiveFriends
          list={this.state.friends.filter((friend) => friend.active === true)}
          onRemoveFriend={this.handleRemoveFriend}
          onToggleFriend={this.handleToggleFriend}
        />
        <InactiveFriends
          list={this.state.friends.filter((friend) => friend.active === false)}
          onToggleFriend={this.handleToggleFriend}
        />
      </div>
    );
  }
}

export default App;
