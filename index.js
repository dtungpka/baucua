const btnShuffle = document.querySelector(".btn-shuffle");
const result1 = document.querySelector(".result-1"),
  result2 = document.querySelector(".result-2"),
  result3 = document.querySelector(".result-3");
const audio = document.querySelector(".audio");
const dataImages = [
  "./images/bau.jpg",
  "./images/tom.jpg",
  "./images/cua.jpg",
  "./images/ca.jpg",
  "./images/huou.jpg",
  "./images/ga.jpg",
];
let dataHistory = localStorage.getItem("dataHistory")
  ? JSON.parse(localStorage.getItem("dataHistory"))
  : [];

//try read from local storage, change to number
let money = localStorage.getItem("money") ? Number(localStorage.getItem("money")) : 1000000;



let isShuffling = false;

let trueMoney = money;
const handleShuffleClick = () => {
  if (isShuffling) return;
  if (trueMoney == 0 && money == 0) {
    alert("Rỗng túi rồi bạn ơi..");
    alert("Bạn quyết định bán sổ đỏ!");
    alert("Tiền +100.000.000 đ");
    money += 100000000;
    trueMoney += 100000000;
    renderMoney();
    return;
  };
  //check if betted
  let sum = 0;
  for (let i = 0; i < 6; i++) {
    sum += selected_bet[i];
  }
  if (sum == 0) {
    alert("Cược đê bạn ơi..");
    return;
  }
  result1.style.opacity = 1;
  result2.style.opacity = 1;
  result3.style.opacity = 1;


  console.log("dac");
  handleShuffle();
};
let randomImg1 = "";
let randomImg2 = "";
let randomImg3 = "";
let Selected = "";
let selected_bet = [0, 0, 0, 0, 0, 0];
const handleShuffle = () => {
  isShuffling = true;
  audio.play();
  const timerId = setInterval(() => {
    randomImg1 = dataImages[randomNumber()];
    randomImg2 = dataImages[randomNumber()];
    randomImg3 = dataImages[randomNumber()];
    result1.setAttribute("src", randomImg1);
    result2.setAttribute("src", randomImg2);
    result3.setAttribute("src", randomImg3);
  }, 100);

  setTimeout(() => {
    clearTimeout(timerId);
    //check if the selected bet is correct
    result1.style.opacity = 0.5;
    result2.style.opacity = 0.5;
    result3.style.opacity = 0.5;
    trueMoney = money;
    for (let i = 0; i < 6; i++) {
      if (randomImg1 == dataImages[i]) {
        if (selected_bet[i] > 0) {
          money += selected_bet[i] * 2;
          trueMoney += selected_bet[i] * 2;
          //set the opacity of the board-n to 1
          result1.style.opacity = 1;

        }
      }
      if (randomImg2 == dataImages[i]) {
        if (selected_bet[i] > 0) {
          money += selected_bet[i] * 2;
          trueMoney += selected_bet[i] * 2;
          result2.style.opacity = 1;
        }
      }
      if (randomImg3 == dataImages[i]) {
        if (selected_bet[i] > 0) {
          money += selected_bet[i] * 2;
          trueMoney += selected_bet[i] * 2;
          result3.style.opacity = 1;
        }
      }
    }




    saveHistory(randomImg1, randomImg2, randomImg3);
    isShuffling = false;
    selected_bet = [0, 0, 0, 0, 0, 0];

    renderBet();
    renderMoney();

  if (money <= 0) {
      alert("Báo quá bạn ơi..");
      renderMoney();
    }


  }, 5000);
};
const addClickEvent = () => {
  //query all <class="board-x"> with x = 1,2,3,4,5,6
  const select_img = document.querySelectorAll(".board-n"); //select_img is a list of <class="board-x">




  select_img.forEach((item) => {
    item.addEventListener("click", () => {
      if (isShuffling) return;
      Selected = item.getAttribute("src");
      //add to selected_bet
      for (let i = 0; i < 6; i++) {
        if (Selected == dataImages[i]) {
          let divider =  trueMoney > 1000 ? (trueMoney/10) : 1000;
          
          if (money >=divider) {
            selected_bet[i] += divider;
            money -= divider;
            renderMoney();
          }
          else if (money > 0) {
            selected_bet[i] += money;
            money = 0;
            renderMoney();
          }
          else {
            alert("Bạn không đủ tiền để cược");
          }
        }
      }
      renderBet();
      console.log(selected_bet);
    });
  });
};
addClickEvent();


const renderBet = () => {
  //dim the board-n if selected_bet[i] > 0 (i = 0,1,2,3,4,5)
  const select_img = document.querySelectorAll(".board-n");
  //and show the bet amount on the board-n
  //get the sum of all bet
  let sum = 0;
  for (let i = 0; i < 6; i++) {
    sum += selected_bet[i];
  }
  if (sum == 0) {
    select_img.forEach((item) => {
      item.style.opacity = 1;
      item.innerHTML = "";
    });
    return;
  }

  select_img.forEach((item) => {
    for (let i = 0; i < 6; i++) {
      if (item.getAttribute("src") == dataImages[i]) {
        if (selected_bet[i] > 0) {
          //calulate the opacity based on the bet amount
          item.style.opacity = Math.min(Math.max( 0.5 + selected_bet[i] / (sum), 0.5), 1);
          
          item.innerHTML = parseMoney(selected_bet[i]);
        }
        else {
          item.style.opacity = 0.5;
          item.innerHTML = "";
        }
      }
    }
  });
};
renderBet();
localStorage.setItem("money", JSON.stringify(money));
const saveHistory = (img1, img2, img3) => {
  dataHistory.unshift([img1, img2, img3]);
  if (dataHistory.length > 10) {
    dataHistory.shift();
  }
  renderHistory();
  localStorage.setItem("dataHistory", JSON.stringify(dataHistory));
};

const renderHistory = () => {
  const historyElement = document.querySelector(".history");
  let htmlHistory = "<h2>Lịch sử</h2>";
  dataHistory.forEach((item) => {
    console.log(item);
    htmlHistory += `<div class="history-item">
    <img src="${item[0]}" alt="" />
    <img src="${item[1]}" alt="" />
    <img src="${item[2]}" alt="" />
  </div>`;
  });
  historyElement.innerHTML = htmlHistory;
};

const renderMoney = () => {
  const moneyElement = document.querySelector(".money");
  moneyElement.innerHTML = '<H1>Tiền: ' + parseMoney(money) + '</H1>';
  //save money to local storage
  localStorage.setItem("money", JSON.stringify(money));
};
const parseMoney = (money) => {
  // 1000000 => 1.000.000
  //round the money to 1
  money = Math.round(money / 1000) * 1000;
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};


const randomNumber = () => {
  return Math.floor(Math.random() * dataImages.length);
};
renderHistory();

btnShuffle.addEventListener("click", handleShuffleClick);
//set volume of audio to 0.1
audio.volume = 0.2;

