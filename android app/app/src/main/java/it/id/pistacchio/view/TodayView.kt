package it.id.pistacchio.view

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import it.id.pistacchio.view.generic.DailyRowChart
import it.id.pistacchio.view.generic.Header

@Composable
fun DailyView() {
    Column {
        Header()

        Text(
            text = "Today I'm doing ...",
            modifier = Modifier
                .padding(8.dp)
        )
        DailyRowChart(
            modifier = Modifier
                .padding(16.dp, 0.dp)

        )
    }
}