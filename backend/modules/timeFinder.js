const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);



function subtractRanges(longRanges, shortRanges)
  {
           /********/
/*
    duration should be sent in as minutes.
    Get meetings within the next month 
    */
//    var timeNow = new Date();
//    var timeMonthFromNow = new Date();
//    timeMonthFromNow.setMonth(timeMonthFromNow.getMonth() + 1);

//    var startR = new moment(timeNow);
//    var endR = new moment(timeMonthFromNow);
   //longRanges = moment.range(startR, endR);

      /*******/

    // Always return an array
    if(shortRanges.length === 0)
      return longRanges.hasOwnProperty("length")
        ? longRanges
        : [longRanges];

    // Result is empty range
    if(longRanges.length === 0)
      return [];

    if(!longRanges.hasOwnProperty("length"))
      longRanges = [longRanges];

    for(let long in longRanges)
    {
      for(let short in shortRanges)
      {
        longRanges[long] = longRanges[long].subtract(shortRanges[short])
        if(longRanges[long].length === 0)
        {
          // Subtracted an entire range, remove it from list
          longRanges.splice(long, 1);
          shortRanges.splice(0, short);
          return this.subtractRanges(longRanges, shortRanges);
        }
        else if(longRanges[long].length === 1)
        {
          // No subtraction made, but .subtract always returns arrays
          longRanges[long] = longRanges[long][0];
        }
        else
        {
          // Successfully subtracted a subrange, flatten and recurse again
          const flat = [].concat(...longRanges);
          shortRanges.splice(0, short);
          return subtractRanges(flat, shortRanges);
        }
      }
    }
    return longRanges;
  }



/*
duration should be sent in as minutes.
*/
    var startR = new moment("2019-01-15T13:00:00");
    var endR = new moment("2019-01-25T19:00:00");







        // var rangeStart = new Date(user.allUserEvents[0].start);
        // //console.log(rangeStart);
        //  var rangeEnd = new Date(user.allUserEvents[0].end);
        //  var busyRange = moment.range(rangeStart, rangeEnd);
        //  //console.log(busyRange.toString())
        //  interval = interval.subtract(busyRange)


        //console.log("THE INTERVAL:")
        //console.log(interval.length);

    // console.log("interval")
    //     console.log(interval)
    //     console.log(interval.length)

    /*
    flatted the nested array.
    */
//    


    /*
        interval is free times between users. If hasDuration == true, return chunks of time greater 
        than or equal to duration. Else return all chunks. 
    */
//     finalFreeTime = [];
//     if (hasDuration){
//         for (var x in interval) {
//             if (x.diff('minutes') >= duration) {
//                 finalFreeTime.append(x.format('LLL'));
//             }
//         }
//     }
//     else {
//         finalFreeTime = interval;
//     }
//     console.log()
//     //console.log(finalFreeTime);
//     return finalFreeTime;
//  }
//for (var x of answers) {




    // console.log(user.allUserEvents);
    // console.log(user.allUserEvents.length)
    // console.log(user.allUserEvents[0])
    // //what I want below
    // console.log(user.allUserEvents[0].start)

//}
function flatten (input) {
    var flattened=[];
    for (var i=0; i<input.length; ++i) {
    var current = input[i];
    for (var j=0; j<current.length; ++j)
        flattened.push(current[j]);
}
return flattened;
}













group = {
"events": [
    {
        "events": [],
        "email": "ckmetto@princeton.edu"
    },
    {
        "events": [
            {
                "end": "2019-01-17T23:00:00-05:00",
                "start": "2019-01-17T21:00:00-05:00"
            },
            {
                "end": "2019-01-18T15:00:00-05:00",
                "start": "2019-01-18T13:00:00-05:00"
            },
            {
                "end": "2019-01-18T21:00:00-05:00",
                "start": "2019-01-18T17:00:00-05:00"
            },
            {
                "end": "2019-01-19T17:00:00-05:00",
                "start": "2019-01-19T13:00:00-05:00"
            },
            {
                "end": "2019-01-20T13:00:00-05:00",
                "start": "2019-01-20T09:00:00-05:00"
            },
            {
                "end": "2019-01-24T23:00:00-05:00",
                "start": "2019-01-24T21:00:00-05:00"
            },
            {
                "end": "2019-01-25T15:00:00-05:00",
                "start": "2019-01-25T13:00:00-05:00"
            },
            {
                "end": "2019-01-25T21:00:00-05:00",
                "start": "2019-01-25T17:00:00-05:00"
            },
            {
                "end": "2019-01-26T17:00:00-05:00",
                "start": "2019-01-26T13:00:00-05:00"
            },
            {
                "end": "2019-01-31T23:00:00-05:00",
                "start": "2019-01-31T21:00:00-05:00"
            }
        ],
        "email": "ckmetto@princeton.edu"
    }
]
}


// function combineGroupEvents(groupEvents) {
   
//         var groupEvents = group.events;
//         var eventsArr = [];
//             for (i=0; i<groupEvents.length; i++) { 
//                // console.log(groupEvents[i].events)
//                 var childArray = groupEvents[i].events;
        
//                 for(j = 0; j < childArray.length;j++) { //groupEvents[i].events
//                     if (childArray[j])
//                         eventsArr.push(childArray[j]);
//                 }
//             }
//             var AllGroupEvents = {allUserEvents:eventsArr}
//             return AllGroupEvents;
//         } 
      
        



// var startR = new moment("2019-01-15T13:00:00");
// var endR = new moment("2019-01-25T19:00:00");

// var longRanges = moment.range(startR, endR);

// events = []
// e = null;
// for (i=0; i<user.allUserEvents.length; i++) {
//     e = moment.range(user.allUserEvents[i].start, user.allUserEvents[i].end); 
//     events.push(e);
// }

// console.log(subtractRanges(longRanges, events));
 




// [ t {
//          start: moment("2019-01-15T11:30:27.838"),
//         end: moment("2019-01-17T21:00:00.000") },
//        t {
//         start: moment("2019-01-17T23:00:00.000"),
//          end: moment("2019-01-18T13:00:00.000") },
//      ]


// function convertMomentToDate(freetimeArr) {
//     var freetime = [];

//     for (i = 0; i < freetimeArr.length; i++) {
//        console.log(freetimeArr[i])
//        var string = freetimeArr[i].toString();
//        var event = string.split('/');
     
       
//        console.log(event)
//        var obj = {start: new Date(event[0]), end: newevent[1]}
//        // var event = {start: freetimeArr[i].start.toDate(), 
//        //     end: freetimeArr[i].end.toDate()}
//            freetime.push(obj);
//     }
//     return freetime;

// }

// var freetimeArr = timeFinder.subtractRanges(interval,events);// compute free time 
// var freeDates = convertMomentToDate(freetimeArr);












module.exports.subtractRanges = subtractRanges;
