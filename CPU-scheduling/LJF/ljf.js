
var sequence;
var complete;
var time;
var i;
var total;
var proc;
var n;
var at=[];
var bt=[];
var stuff=[];
var index=1;
var average_wt;
var average_tat;
var throughput;
var cpu_efficiency;
$(document).ready(function () {
  $('#add').click(function () {
    AddtoList();
  })
  function DisplayList() {
    var table = document.getElementById("ept");
    console.log(stuff[stuff.length - 1].no);
    $('#ept').append("<tr style=" + "background-color:#fff;" + "><td>" + stuff[stuff.length - 1].no + "</td><td>" + stuff[stuff.length - 1].at + "</td><td>" + stuff[stuff.length - 1].bt1 + "</td></tr>");

  }
  function AddtoList() {
    var arrivalTime = parseInt(document.getElementById("at1").value);
    var burstTime = parseInt(document.getElementById("bt1").value);


    if (document.getElementById("at1").value == "") {
      alert("Arrival time field is empty!");
      return;
    }

    if (document.getElementById("bt1").value == "") {
      alert("Burst time field is empty!");
      return;
    }

    if (arrivalTime < 0) {
      alert("Arrival time cannot be negative!");
      return;
    }

    if (burstTime < 0) {
      alert("Burst time cannot be negative!");
      return;
    }

    var ioTime = parseInt("0");
    var FinalburstTime = parseInt("0");
    console.log(arrivalTime);
    console.log(burstTime);
    var rtj = [];
    rtj.push(burstTime);
    rtj.push(ioTime);
    rtj.push(FinalburstTime);
    console.log(rtj);
    stuff.push({
      "at": arrivalTime,
      "bt1": burstTime,
      "io": ioTime,
      "bt2": FinalburstTime,
      "check": parseInt("0"),
      "finish": parseInt("0"),
      "no": index,
      "rt": rtj,
      "point": parseInt("0"),
      "wt": parseInt("0"),
      "tat": parseInt("0")
    });
    index = index + 1;
    document.getElementById("at1").value = "";
    document.getElementById("bt1").value = "";

    console.log(stuff);
    DisplayList();
  };
  $('#start').click(function(){
    ljf();
    var i = 0;
  console.log(total);
   console.log(sequence[total].start);
    var totalTime = sequence[total].start;
    pixel = parseInt(600/totalTime);
    console.log("%d---%d\n",totalTime,pixel);
    var containerWidth = pixel*totalTime + 2;
    console.log("containerWidth is %d",containerWidth);
    $('#outer-div').css('width',containerWidth+'px');
    displayBlock(i);
  })
  function ljf(){
    var proc=[];
    for(i=0;i<stuff.length;i++){
      proc.push(i+1);
    }
    var n=stuff.length;
    for(i=0;i<n;i++){
      for(j=i+1;j<n;j++){
        if(stuff[i].at>stuff[j].at)
        {
          var temp;
          temp=stuff[i];
          stuff[i]=stuff[j];
          stuff[j]=temp;
          temp=proc[i];
          proc[i]=proc[j];
          proc[j]=temp;
        }
      }
    }
    console.log(stuff);
    var time=0;
    var complete=0;
    var temp=-1000;
    var st_time;
    sequence=[];
    var minus;
    while(complete!=n)
    {
      var min=0;
      var minindex=100;
      for(i=0;i<n;i++){
        if(stuff[i].at<=time && stuff[i].finish==0 && (stuff[i].point==0 || stuff[i].point==2) && stuff[i].check==0 && stuff[i].rt[stuff[i].point]>min){
          console.log(stuff[i]);
          min=stuff[i].rt[stuff[i].point];
          minindex=i;
        }
      }
      console.log(minindex);
      if(minindex<stuff.length){
        if(temp!=minindex){
          st_time=time;
        }
        minus=stuff[minindex].rt[stuff[minindex].point];
        stuff[minindex].rt[stuff[minindex].point]=0;
        time=time+minus;
        console.log(time);
        console.log(minindex);
        if(temp!=minindex){
          sequence.push({start:st_time,n:stuff[minindex].no});
        }
        for(i=0;i<stuff.length;i++){
          if(stuff[i].check==1){
            stuff[i].rt[stuff[i].point]-=minus;
            if(stuff[i].rt[stuff[i].point]<=0)
            {
              stuff[i].check=0;
              stuff[i].point++;
            }
          }
        }
        if(stuff[minindex].rt[stuff[minindex].point]==0){
          if(stuff[minindex].point==0){
            if(stuff[minindex].rt[1]==0 && stuff[minindex].rt[2]==0)
            {
              complete++;
              stuff[minindex].finish=1;
              stuff[minindex].tat=time-stuff[minindex].at;
              stuff[minindex].wt=stuff[minindex].tat-stuff[minindex].bt1-stuff[minindex].bt2;
            }
            stuff[minindex].check=1;
            stuff[minindex].point=1;
          }
          if(stuff[minindex].point==2){
            console.log(minindex);
            complete=complete+1;
            stuff[minindex].tat=time-stuff[minindex].at;
            stuff[minindex].wt=stuff[minindex].tat-stuff[minindex].bt1-stuff[minindex].bt2;
            stuff[minindex].finish=1;
            console.log(stuff);
          }
        }
        temp=minindex;
      }
      if(min==0 && minindex==100){
        console.log(time);
        var temp1=null;
        if(temp!=temp1)
          st_time=time;
        time=time+1;
        if(temp!=temp1){
          sequence.push({start:st_time,n:null});
        }
        for(i=0;i<stuff.length;i++){
          if(stuff[i].check==1){
            stuff[i].rt[stuff[i].point]--;
            if(stuff[i].rt[stuff[i].point]==0)
            {
              stuff[i].check=0;
              stuff[i].point=2;
            }
          }
        }
        temp=null;
        console.log(time);
      }
    }
    sequence.push({start:time,n:-1});
    console.log(sequence);
    total = sequence.length-1;
    console.log(total);
    var sum_at=0;
    for(i=0;i<n;i++)
      sum_at+=stuff[i].wt;
    average_wt=sum_at/n;
    var sum_tat=0;
    for(i=0;i<n;i++)
      sum_tat+=stuff[i].tat;
    average_tat=sum_tat/n;
    var pixel = 0;
    throughput=n/time;
    var sum_null=0;
    for(i=0;i<sequence.length;i++)
    {
      if(sequence[i].n==null)
      {
        sum_null+=sequence[i+1].start-sequence[i].start;
      }
    }
    cpu_efficiency=((time-sum_null)/time)*100;
    for(i=0;i<n;i++)
      console.log(stuff[i].tat);
  }
  function drawTable(i){
    if(i<stuff.length){
    var table = document.getElementById("ptable");
    console.log(stuff[i].tat);
    $("#ptable").append("<tr><td>"+stuff[i].no+"</td><td>"+stuff[i].at+"</td><td>"+stuff[i].bt1+"</td><td>"+stuff[i].wt+"</td><td>"+stuff[i].tat+"</td></tr>"); //changed here
    drawTable(i+1);
  }
  else
  {
    $("#Average").append("<b>The average waiting time of the given processes is "+average_wt+"</b><br>");
    $("#Average").append("<b>The average turn around time of the given processes is "+average_tat+"</b><br>");
    $("#Average").append("<b>The throughput of the given processes is "+throughput+"</b><br>");
    $("#Average").append("<b>The CPU efficiency is "+cpu_efficiency+"%</b><br>");
  }

}



  function displayBlock(i){
    if(i == total){
      document.getElementById("ptab").style.display='block';
      drawTable(0);
      return;
    }

    var blockWidth = (sequence[i+1].start - sequence[i].start)*pixel;
    var processName = sequence[i].n;
    if(sequence[i].n==null)
    {
      $('#outer-div').append('<div class="block" id="process-'+sequence[i].start +'">CPU Idle<div class="bottom">'+ sequence[i+1].start +'</div></div>');
    }
    else
    {
      $('#outer-div').append('<div class="block" id="process-'+sequence[i].start +'">P-'+ sequence[i].n +'<div class="bottom">'+ sequence[i+1].start +'</div></div>');
    }
    $('#process-'+sequence[i].start).css('width',blockWidth);

    $('#process-'+sequence[i].start).fadeIn('slow',function(){
      displayBlock(i+1);
    });

  }
});