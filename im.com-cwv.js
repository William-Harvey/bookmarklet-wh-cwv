javascript:(function(){
    var s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(s);
    s.onload = function(){
        gapi.load('client', function(){
            gapi.client.setApiKey('YOUR_API_KEY');  // Replace with your actual API key
            gapi.client.load('https://chromeuxreport.googleapis.com/$discovery/rest?version=v1').then(function(){
                gapi.client.chromeuxreport.records.queryHistoryRecord({
                    'resource': {'url': window.location.href}
                }).then(function(response){
                    var data = response.result;
                    if(data.record && data.record.metrics){
                        var popup = document.createElement('div');
                        popup.style.position = 'fixed';
                        popup.style.top = '5%';
                        popup.style.left = '5%';
                        popup.style.width = '90%';
                        popup.style.height = '90%';
                        popup.style.backgroundColor = '#fff';
                        popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
                        popup.style.zIndex = '10000';
                        popup.style.padding = '20px';
                        popup.style.overflowY = 'scroll';

                        var closeBtn = document.createElement('button');
                        closeBtn.innerHTML = 'Close';
                        closeBtn.style.position = 'absolute';
                        closeBtn.style.top = '10px';
                        closeBtn.style.right = '10px';
                        closeBtn.onclick = function(){
                            document.body.removeChild(popup);
                        };
                        popup.appendChild(closeBtn);

                        var title = document.createElement('h2');
                        title.innerHTML = 'Core Web Vitals Data';
                        popup.appendChild(title);

                        function createLineChart(metricName, metricData, thresholds){
                            var chartContainer = document.createElement('div');
                            var chartTitle = document.createElement('h3');
                            chartTitle.textContent = metricName + ' Line Chart:';
                            chartContainer.appendChild(chartTitle);

                            var canvas = document.createElement('canvas');
                            canvas.width = 800;
                            canvas.height = 300;
                            canvas.style.border = '1px solid black';
                            chartContainer.appendChild(canvas);

                            var ctx = canvas.getContext('2d');

                            if(metricData && metricData.percentilesTimeseries && metricData.percentilesTimeseries.p75s){
                                var values = metricData.percentilesTimeseries.p75s;
                                var filteredValues = values.filter(function(v){ return v != null && !isNaN(v); });
                                if(filteredValues.length === 0){
                                    var noDataMsg = document.createElement('p');
                                    noDataMsg.textContent = 'No data available for this metric.';
                                    chartContainer.appendChild(noDataMsg);
                                    popup.appendChild(chartContainer);
                                    return;
                                }
                                var maxValue = Math.max.apply(null, filteredValues.concat([thresholds.poor]));
                                var minValue = 0;
                                var padding = 60;
                                var chartWidth = canvas.width - 2 * padding;
                                var chartHeight = canvas.height - 2 * padding;

                                // Draw threshold zones with solid colors
                                var yGood = padding + ((maxValue - thresholds.good) / (maxValue - minValue)) * chartHeight;
                                var yNeedsImprovement = padding + ((maxValue - thresholds.needsImprovement) / (maxValue - minValue)) * chartHeight;
                                var yPoor = padding + ((maxValue - thresholds.poor) / (maxValue - minValue)) * chartHeight;

                                // Good zone
                                ctx.fillStyle = '#ccffcc'; // Light Green
                                ctx.fillRect(padding, yGood, chartWidth, canvas.height - padding - yGood);

                                // Needs Improvement zone
                                ctx.fillStyle = '#fff5cc'; // Light Yellow
                                ctx.fillRect(padding, yNeedsImprovement, chartWidth, yGood - yNeedsImprovement);

                                // Poor zone
                                ctx.fillStyle = '#ffcccc'; // Light Red
                                ctx.fillRect(padding, yPoor, chartWidth, yNeedsImprovement - yPoor);

                                // Draw thresholds
                                ctx.strokeStyle = '#00cc00';
                                ctx.beginPath();
                                ctx.moveTo(padding, yGood);
                                ctx.lineTo(canvas.width - padding, yGood);
                                ctx.stroke();

                                ctx.strokeStyle = '#ffaa00';
                                ctx.beginPath();
                                ctx.moveTo(padding, yNeedsImprovement);
                                ctx.lineTo(canvas.width - padding, yNeedsImprovement);
                                ctx.stroke();

                                ctx.strokeStyle = '#ff0000';
                                ctx.beginPath();
                                ctx.moveTo(padding, yPoor);
                                ctx.lineTo(canvas.width - padding, yPoor);
                                ctx.stroke();

                                // Draw data line
                                ctx.beginPath();
                                for(var i = 0; i < values.length; i++){
                                    var value = values[i];
                                    if(value == null || isNaN(value)){
                                        continue;
                                    }
                                    var x = padding + (i / (values.length - 1)) * chartWidth;
                                    var y = padding + ((maxValue - value) / (maxValue - minValue)) * chartHeight;
                                    if(i === 0){
                                        ctx.moveTo(x, y);
                                    } else {
                                        ctx.lineTo(x, y);
                                    }
                                }
                                ctx.strokeStyle = '#0000ff';
                                ctx.lineWidth = 2;
                                ctx.stroke();

                                // Draw axes
                                ctx.beginPath();
                                ctx.moveTo(padding, padding);
                                ctx.lineTo(padding, canvas.height - padding);
                                ctx.lineTo(canvas.width - padding, canvas.height - padding);
                                ctx.strokeStyle = '#000';
                                ctx.lineWidth = 1;
                                ctx.stroke();

                                // X-axis labels
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = '#000';
                                var dates = data.record.collectionPeriods.map(function(period){
                                    return period.firstDate.year + '-' + ('0' + period.firstDate.month).slice(-2) + '-' + ('0' + period.firstDate.day).slice(-2);
                                });
                                for(var j = 0; j < values.length; j++){
                                    var x = padding + (j / (values.length - 1)) * chartWidth;
                                    var y = canvas.height - padding + 5;
                                    ctx.save();
                                    ctx.translate(x, y);
                                    ctx.rotate(-Math.PI / 2);
                                    ctx.fillText(dates[j] || '', 0, 0);
                                    ctx.restore();
                                }

                                // Y-axis labels
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                var numYLabels = 5;
                                for(var k = 0; k <= numYLabels; k++){
                                    var yValue = minValue + (k / numYLabels) * (maxValue - minValue);
                                    var y = padding + (1 - k / numYLabels) * chartHeight;
                                    ctx.fillText(yValue.toFixed(2), padding - 10, y);
                                    ctx.beginPath();
                                    ctx.moveTo(padding - 5, y);
                                    ctx.lineTo(padding, y);
                                    ctx.stroke();
                                }

                                // Legend
                                var legendX = canvas.width - padding + 20;
                                var legendY = padding;
                                ctx.textAlign = 'left';
                                ctx.fillStyle = '#000';
                                ctx.fillText('Legend:', legendX, legendY);
                                legendY += 20;

                                ctx.fillStyle = '#ccffcc';
                                ctx.fillRect(legendX, legendY - 10, 10, 10);
                                ctx.fillStyle = '#000';
                                ctx.fillText('Good', legendX + 15, legendY);
                                legendY += 20;

                                ctx.fillStyle = '#fff5cc';
                                ctx.fillRect(legendX, legendY - 10, 10, 10);
                                ctx.fillStyle = '#000';
                                ctx.fillText('Needs Improvement', legendX + 15, legendY);
                                legendY += 20;

                                ctx.fillStyle = '#ffcccc';
                                ctx.fillRect(legendX, legendY - 10, 10, 10);
                                ctx.fillStyle = '#000';
                                ctx.fillText('Poor', legendX + 15, legendY);
                                legendY += 20;

                                ctx.strokeStyle = '#0000ff';
                                ctx.beginPath();
                                ctx.moveTo(legendX, legendY);
                                ctx.lineTo(legendX + 20, legendY);
                                ctx.stroke();
                                ctx.fillText('Metric Value', legendX + 25, legendY);
                            } else {
                                var noDataMsg2 = document.createElement('p');
                                noDataMsg2.textContent = 'No data available for this metric.';
                                chartContainer.appendChild(noDataMsg2);
                            }
                            popup.appendChild(chartContainer);
                        }

                        // Define thresholds for each metric
                        var thresholds = {
                            'Largest Contentful Paint (LCP)': {good: 2500, needsImprovement: 4000, poor: 4000},
                            'First Contentful Paint (FCP)': {good: 1800, needsImprovement: 3000, poor: 3000},
                            'Cumulative Layout Shift (CLS)': {good: 0.1, needsImprovement: 0.25, poor: 0.25},
                            'Time to First Byte (TTFB)': {good: 800, needsImprovement: 1800, poor: 1800},
                            'Interaction to Next Paint (INP)': {good: 200, needsImprovement: 500, poor: 500}
                        };

                        // Generate charts for each metric
                        createLineChart('Largest Contentful Paint (LCP)', data.record.metrics.largest_contentful_paint, thresholds['Largest Contentful Paint (LCP)']);
                        createLineChart('First Contentful Paint (FCP)', data.record.metrics.first_contentful_paint, thresholds['First Contentful Paint (FCP)']);
                        createLineChart('Cumulative Layout Shift (CLS)', data.record.metrics.cumulative_layout_shift, thresholds['Cumulative Layout Shift (CLS)']);
                        createLineChart('Time to First Byte (TTFB)', data.record.metrics.experimental_time_to_first_byte, thresholds['Time to First Byte (TTFB)']);
                        createLineChart('Interaction to Next Paint (INP)', data.record.metrics.interaction_to_next_paint, thresholds['Interaction to Next Paint (INP)']);

                        document.body.appendChild(popup);
                    } else {
                        alert('No Core Web Vitals data available for this page.');
                    }
                }).catch(function(err){
                    console.error('Error executing CWV data request:', err);
                    alert('Failed to fetch Core Web Vitals data.');
                });
            }).catch(function(err){
                console.error('Error loading Chrome UX Report API:', err);
                alert('Failed to load the Chrome UX Report API.');
            });
        }, function(err){
            console.error('Error loading GAPI client:', err);
            alert('Failed to load the GAPI client.');
        });
    };
})();
