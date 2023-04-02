import "./App.css";
import React, { Component } from "react";
import Cookies from "js-cookie";
import { BsController } from "react-icons/bs";
import "sweetalert2/dist/sweetalert2.min.css";
import Modal from "./components/Modal";

class App extends Component<AppProps, AppState> {
  timerId: NodeJS.Timeout | undefined;
  constructor(props: AppState) {
    super(props);
    this.state = {
      SysWord: "",
      isGameOver: false,
      score: 0,
      time: 59,
      words: [],
      resetModal: false,
      btnText: "Reset",
    };
  }

  componentDidMount() {
    this.getWord();
    Cookies.set("TopScore", JSON.stringify(0));
    this.timerId = setInterval(() => this.timer(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  timer = () => {
    const { time } = this.state;
    if (time !== 0) {
      const dereasedTime = time - 1;
      this.setState({ time: dereasedTime });
    } else {
      let { score } = this.state;
      clearInterval(this.timerId);
      let previousScore: string | number | undefined = Cookies.get("TopScore");
      if (previousScore !== undefined) {
        if (score > parseInt(previousScore)) {
          let NewScore = JSON.stringify(score);
          Cookies.set("TopScore", NewScore);
        }
      }
      this.setState({ isGameOver: true });
      return null;
    }
  };

  getWord = async () => {
    const url = "https://random-word-api.herokuapp.com/word";
    const reponse = await fetch(url);
    const FetchResult = await reponse.json();
    const Word = FetchResult[0];
    const ShuffledWords = [
      { key: "a", word: Word },
      {
        key: "b",
        word: Word.split("")
          .sort(function () {
            return 0.5 - Math.random();
          })
          .join(""),
      },
      {
        key: "c",
        word: Word.split("")
          .sort(function () {
            return 0.5 - Math.random();
          })
          .join(""),
      },
      {
        key: "d",
        word: Word.split("")
          .sort(function () {
            return 0.5 - Math.random();
          })
          .join(""),
      },
      {
        key: "e",
        word: Word.split("")
          .sort(function () {
            return 0.5 - Math.random();
          })
          .join(""),
      },
    ];
    const ShuffledArrayWords = ShuffledWords.sort(() => Math.random() - 0.5);
    await this.setState({ SysWord: Word, words: ShuffledArrayWords });
  };

  CheckWord = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { SysWord } = this.state;
    const UserOption = e.currentTarget.id;
    if (SysWord === UserOption && this.state.time > 0) {
      await this.setState((prevState) => ({ score: prevState.score + 1 }));
      this.getWord();
    } else {
      this.getWord();
    }
  };

  ResetGame = () => {
    this.getWord();
    this.setState({ score: 0, time: 59, resetModal: false });
  };

  onClickRetry = () => {
    this.getWord();
    this.setState({ isGameOver: false, score: 0, time: 59 });
    this.timerId = setInterval(() => this.timer(), 1000);
  };

  renderResetModal = (val: boolean) => {
    if (this.state.btnText === "Start") {
      this.setState({ score: 0, time: 59, btnText: "Reset" });
      this.timerId = setInterval(() => this.timer(), 1000);
    } else {
      this.setState({ resetModal: val });
    }
  };

  closeModal = () => {
    this.setState({ isGameOver: false, btnText: "Start" });
    clearInterval(this.timerId);
  };

  render() {
    const { score, time, SysWord, words, isGameOver, resetModal, btnText } =
      this.state;
    let TScore: number | string | undefined = Cookies.get("TopScore");

    return (
      <>
        <div className="main_background">
          <header className="header_container">
            <div className="IconContainer">
              <h1>JUMBLEQUEST</h1>
              <BsController
                size={40}
                style={{ color: "white", marginLeft: "5px" }}
              />
            </div>

            <div className="score_time_container">
              <h4>Top Score: {TScore ? TScore : 0}</h4>
              <h4>Score : {score}</h4>
              <h4>Time left : {time}</h4>
            </div>
          </header>
          <div className="bottom_container">
            <div className="word_container">
              <button className="word-btn">{SysWord}</button>
            </div>
            <div className="options_container">
              <div className="button_container">
                {words.map((each) => {
                  return (
                    <button
                      className="btn btn-light m-3"
                      key={each.key}
                      id={each.word}
                      onClick={this.CheckWord}
                    >
                      {each.word}
                    </button>
                  );
                })}
              </div>
              <button
                className="btn btn-danger custom-btn"
                onClick={() => this.renderResetModal(true)}
              >
                {btnText}
              </button>
            </div>
          </div>
        </div>
        {isGameOver && (
          <Modal>
            <h3>GameOver!!!</h3>
            <div className="custom-modal-footer">
              <button className="btn btn-danger" onClick={this.onClickRetry}>
                Retry
              </button>
              <button
                className="btn btn-info"
                onClick={() => this.closeModal()}
              >
                Close
              </button>
            </div>
          </Modal>
        )}
        {resetModal && (
          <Modal>
            <h3>Are you sure to Restart ??</h3>
            <p>Restart won't record your current score!!!</p>
            <div className="custom-modal-footer">
              <button className="btn btn-danger" onClick={this.ResetGame}>
                Restart
              </button>
              <button
                className="btn btn-info"
                onClick={() => this.renderResetModal(false)}
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

interface AppState {
  SysWord: string;
  btnText: string;
  isGameOver: boolean;
  score: number;
  time: number;
  words: { key: string; word: string }[];
  resetModal: boolean;
}
interface AppProps {}

export default App;
