
 /*constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
        }
    }

    componentDidMount() {
        const url = "https://api.the-odds-api.com/v3/odds/?apiKey=32537244e2372228d57f009ba53a1d46&sport=baseball_mlb&region=us&mkt=spreads&oddsFormat=american&dateFormat=iso"
        fetch(url, {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log("res after api call ==>", responseJson)
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.data,
                }, function(){

                })
        })
        .catch(error=>console.log(error))
    } */